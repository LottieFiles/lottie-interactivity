const DEFAULT_OPTIONS = {
  player: 'lottie-player',
};
const LOTTIE_PLAYER_NODE = 'LOTTIE-PLAYER';
const ERROR_PREFIX = '[lottieInteractivity]:';

/**
 * LottieFiles interactivity for Lottie
 */
export class LottieInteractivity {
  constructor({ actions, container, mode, player, ...options } = DEFAULT_OPTIONS) {
    // Resolve lottie instance specified in player option
    if (!(typeof player === 'object' && player.constructor.name === 'AnimationItem')) {
      if (typeof player === 'string') {
        const elem = document.querySelector(player);

        if (elem && elem.nodeName === LOTTIE_PLAYER_NODE) {
          player = elem.getLottie();
        }
      } else if (player instanceof HTMLElement && player.nodeName === LOTTIE_PLAYER_NODE) {
        player = player.getLottie();
      }

      // Throw error no player instance has been successfully resolved
      if (!player) {
        throw new Error(`${ERROR_PREFIX} Specified player is invalid.`, player);
      }
    }

    // Get the configured container element.
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }

    // Use player wrapper as fallback if container couldn't be resolved.
    if (!container) {
      container = player.wrapper;
    }

    this.player = player;
    this.container = container;
    this.mode = mode;
    this.actions = actions;
    this.options = options;
    this.assignedSegment = null;
    this.scrolledAndPlayed = false;

    // Interaction chaining
    this.interactionIdx = 0;
    this.clickCounter = 0;
    this.playCounter = 0;
    this.stateHandler = new Map();
    this.transitionHandler = new Map();
  }

  getContainerVisibility() {
    // Get the bounding box for the lottie player or container
    const { top, height } = this.container.getBoundingClientRect();

    // Calculate current view percentage
    const current = window.innerHeight - top;
    const max = window.innerHeight + height;
    return current / max;
  }

  getContainerCursorPosition(cursorX, cursorY) {
    const { top, left, width, height } = this.container.getBoundingClientRect();

    const x = (cursorX - left) / width;
    const y = (cursorY - top) / height;

    return { x, y };
  }

  start() {
    const Parentscope = this;
    // Configure player for start
    if (this.mode === 'scroll') {
      this.player.addEventListener('DOMLoaded', function () {
        Parentscope.player.stop();
        window.addEventListener('scroll', Parentscope.#scrollHandler);
      });
    } else if (this.mode === 'cursor') {
      this.player.addEventListener('DOMLoaded', function () {
        // To have click and hover interaction, force to only have that type and single action
        // If there are multiple actions, click and hover are ignored
        if (Parentscope.actions &&
          Parentscope.actions.length === 1) {
          if (Parentscope.actions[0].type === "click") {
            Parentscope.player.loop = false;
            Parentscope.player.stop();
            Parentscope.container.addEventListener('click', Parentscope.#clickHoverTransitionHandler);
          } else if (Parentscope.actions[0].type === "hover") {
            Parentscope.player.loop = false;
            Parentscope.player.stop();
            Parentscope.container.addEventListener('mouseenter', Parentscope.#clickHoverTransitionHandler);
          } else if (Parentscope.actions[0].type === "hold" || Parentscope.actions[0].type === "pauseHold") {
            Parentscope.container.addEventListener('mouseenter', Parentscope.#holdTransitionEnter);
            Parentscope.container.addEventListener('mouseleave', Parentscope.#holdTransitionLeave);
          } else if (Parentscope.actions[0].type === "seek") {
            Parentscope.player.loop = true;
            Parentscope.player.stop();
            Parentscope.container.addEventListener('mousemove', Parentscope.#mousemoveHandler);
            Parentscope.container.addEventListener('mouseout', Parentscope.#mouseoutHandler);
          }
        } else {
          Parentscope.player.loop = true;
          Parentscope.player.stop();
          Parentscope.container.addEventListener('mousemove', Parentscope.#mousemoveHandler);
          Parentscope.container.addEventListener('mouseout', Parentscope.#mouseoutHandler);
        }
      });
    } else if (this.mode === 'chain') {
      this.player.addEventListener('DOMLoaded', () => {
        this.#initInteractionMaps();
        Parentscope.player.loop = false;
        Parentscope.player.stop();
        this.#chainedInteractionHandler();
      });
    }
  }

  stop() {
    if (this.mode === 'scroll') {
      window.removeEventListener('scroll', this.#scrollHandler);
    }

    if (this.mode === 'cursor') {
        this.container.removeEventListener('click', this.#clickHoverTransitionHandler);
        this.container.removeEventListener('mouseenter', this.#clickHoverTransitionHandler);
        this.container.removeEventListener('mousemove', this.#mousemoveHandler);
        this.container.removeEventListener('mouseout', this.#mouseoutHandler);
    }
  }

  #initInteractionMaps = () => {
    let loopState = () => {
      if (this.actions[this.interactionIdx].loop) {
        this.player.loop = parseInt(this.actions[this.interactionIdx].loop) - 1;
      } else {
        this.player.loop = true;
      }
      this.player.autoplay = true;
    }
    let autoplayState = () => {
      this.player.loop = false;
      this.player.autoplay = true;
    }
    let clickState = () => {
      this.player.loop = false;
      this.player.autoplay = false;
      this.container.addEventListener('click', this.#clickHoverTransitionHandler);
    }
    let hoverState = () => {
      this.player.loop = false;
      this.player.autoplay = false;
      this.container.addEventListener('mouseenter', this.#hoverStateHandler);
    }
    let clickTransition = () => {
      this.container.addEventListener('click', this.#clickHoverTransitionHandler);
    }
    let hoverTransition = () => {
      this.container.addEventListener('mouseenter', this.#clickHoverTransitionHandler);
    }
    let holdTransition = () => {
      this.player.addEventListener('enterFrame', this.#holdTransitionHandler);
      this.container.addEventListener('mouseenter', this.#holdTransitionEnter);
      this.container.addEventListener('mouseleave', this.#holdTransitionLeave);
    }
    let repeatTransition = () => {
      this.player.loop = true;
      this.player.autoplay = true;
      let handler = () => { this.#repeatTransition({handler}) };
      this.player.addEventListener('loopComplete', handler);
    }
    let onCompleteTransition = () => {
      let state = this.actions[this.interactionIdx].state;
      let handler = () => { this.#onCompleteHandler({interactionStage: this.interactionIdx, handler}) };
      if (state === 'loop')
        this.player.addEventListener('loopComplete', handler);
      else if (state === 'autoplay')
        this.player.addEventListener('complete', handler);
    }
    let cursorSyncTransition = () => {
      this.player.stop();
      this.player.addEventListener('enterFrame', this.#cursorSyncHandler);
      this.container.addEventListener('mousemove', this.#mousemoveHandler);
      this.container.addEventListener('mouseout', this.#mouseoutHandler);
    }
    this.stateHandler.set('loop', loopState);
    this.stateHandler.set('autoplay', autoplayState);
    this.stateHandler.set('click', clickState);
    this.stateHandler.set('hover', hoverState);

    this.transitionHandler.set('click', clickTransition);
    this.transitionHandler.set('hover', hoverTransition);
    this.transitionHandler.set('hold', holdTransition);
    this.transitionHandler.set('pauseHold', holdTransition);
    this.transitionHandler.set('repeat', repeatTransition);
    this.transitionHandler.set('onComplete', onCompleteTransition);
    this.transitionHandler.set('seek', cursorSyncTransition);
  }

  // Used to manage hover state on chained interactions
  #hoverStateHandler = () => {
    let forceFlag = this.actions[this.interactionIdx].forceFlag;

    if (!forceFlag && this.player.isPaused === true) {
      this.#playSegmentHandler(true);
    } else if (forceFlag) {
      this.#playSegmentHandler(true);
    }
  }

  // Used to manage click and hover transitions
  #clickHoverTransitionHandler = e => {
    let forceFlag = this.actions[this.interactionIdx].forceFlag;
    let transition = this.actions[this.interactionIdx].transition;
    let state = this.actions[this.interactionIdx].state;

    // If we're in chain made and the click or hover transition is used, otherwise just play the animation
    if (this.mode === 'chain') {
      // If the state is click, then play the animation on click
      if (state === 'click') {
        if (!forceFlag && this.player.isPaused === true) {
          this.#playSegmentHandler(true);
        } else if (forceFlag) {
          this.#playSegmentHandler(true);
        }
      }

      // If the transition is click, check if there is a counter or not and make a transition
      if (transition === 'click' || transition === 'hover') {
        if (this.actions[this.interactionIdx].click) {
          let clickLimit = parseInt(this.actions[this.interactionIdx].click);
          if (this.clickCounter < clickLimit - 1) {
            this.clickCounter += 1;
            return ;
          }
        }
        this.clickCounter = 0;
        this.container.removeEventListener('click', this.#clickHoverTransitionHandler);
        this.container.removeEventListener('mouseenter', this.#clickHoverTransitionHandler);
        this.#nextInteraction();
      }
      return ;
    }
    // Using goToAndPlay rather than this.#playSegmentHandler(forceFlag) because we're in cursor mode
    if (!forceFlag && this.player.isPaused === true) {
      this.player.goToAndPlay(0, true);
    } else if (forceFlag) {
      this.player.goToAndPlay(0, true);
    }
  }

  #mousemoveHandler = e => {
    this.#cursorHandler(e.clientX, e.clientY);
  };

  #mouseoutHandler = () => {
    this.#cursorHandler(-1, -1);
  };

  animate({ timing, draw, duration }) {
    let start = performance.now();

    requestAnimationFrame(function animate(time) {
      // timeFraction goes from 0 to 1
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      // calculate the current animation state
      let progress = timing(timeFraction);

      draw(progress); // draw it

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  }

  #onCompleteHandler = ({interactionStage, handler}) => {
    if (interactionStage === this.interactionIdx) {
      this.player.removeEventListener('loopComplete', handler);
      this.player.removeEventListener('complete', handler);
      this.#nextInteraction();
    }
  }

  #repeatTransition = ({handler}) => {
    let repeatAmount = 1;

    if (this.actions[this.interactionIdx].repeat)
      repeatAmount = this.actions[this.interactionIdx].repeat;
    if (this.playCounter >= repeatAmount - 1) {
      this.playCounter = 0;
      this.player.removeEventListener('loopComplete', handler);
      this.player.loop = false;
      this.player.autoplay = false;
      this.#nextInteraction();
    } else {
      this.playCounter += 1;
    }
  }

  #cursorSyncHandler = () => {
    if (this.player.currentFrame >= parseInt(this.actions[this.interactionIdx].frames[1]) - 1) {
      this.player.removeEventListener('enterFrame', this.#cursorSyncHandler);
      this.container.removeEventListener('mousemove', this.#mousemoveHandler);
      this.container.removeEventListener('mouseout', this.#mouseoutHandler);
      setTimeout(this.#nextInteraction, 0);
    }
  }

  // TODO: How does this work with markers? Get marker duration?
  // With the hold transition we can't use playSegment so have to manually verify if
  // The user held long enough and check if the current frame is within the segment limits
  #holdTransitionHandler = () => {
    if (this.player.currentFrame >= this.actions[this.interactionIdx].frames[1]) {
      this.player.removeEventListener('enterFrame', this.#holdTransitionHandler);
      this.container.removeEventListener('mouseenter', this.#holdTransitionEnter);
      this.container.removeEventListener('mouseleave', this.#holdTransitionLeave);
      this.player.pause();
      this.#nextInteraction();
    }
  }

  #holdTransitionEnter = () => {
    if (this.player.playDirection === -1
      || this.player.currentFrame === 0
      || this.actions[this.interactionIdx].transition === "pauseHold"
      || this.actions[0].type === "pauseHold") {
      this.player.setDirection(1);
      this.player.play();
    }
  }

  #holdTransitionLeave = () => {
    if (this.actions[this.interactionIdx].transition === "hold" || this.actions[0].type === "hold") {
      this.player.setDirection(-1);
      this.player.play();
    } else if (this.actions[this.interactionIdx].transition === "pauseHold" || this.actions[0].type === "pauseHold"){
      this.player.pause();
    }
  }

  #clearStateListeners = () => {
    let state = this.actions[this.interactionIdx].state;

    if (state === "hover" || state === "click") {
      this.container.removeEventListener('click', this.#clickHoverTransitionHandler);
      this.container.removeEventListener('mouseenter', this.#hoverStateHandler);
    }
  }

  #nextInteraction = () => {
    let oldIdx =  this.interactionIdx;

    // If state is hover or click we need to remove listeners
    this.#clearStateListeners();

    // Check if theres a jump-to before incrementing
    let jumpToIndex = this.actions[this.interactionIdx].jumpTo;
    if (jumpToIndex) {
      // If jumpToIndex is inside action length jump to it otherwise go to first action
      if (jumpToIndex >= 0 && jumpToIndex < this.actions.length) {
        this.interactionIdx = jumpToIndex;
        this.#chainedInteractionHandler();
      } else {
        this.interactionIdx = 0;
        this.player.goToAndStop(0, true);
        this.#chainedInteractionHandler();
      }
    } else {
      // Go to next interaction
      this.interactionIdx++;
      if (this.interactionIdx >= this.actions.length) {
        // Go back to the first interaction ?
        if (this.actions[this.actions.length - 1].reset) {
          this.interactionIdx = 0;
          this.player.goToAndStop(0, true);
          this.#chainedInteractionHandler();
        }
        else
          this.interactionIdx = this.actions.length - 1;
      } else {
        this.#chainedInteractionHandler();
      }
    }

    // Emit event from the lottie-player element
    this.container.dispatchEvent(new CustomEvent("transition", {
      bubbles: true,
      composed: true,
      detail: { oldIndex: oldIdx, newIndex: this.interactionIdx }
    }));
  }

  // Checks if frames are an array or string, and calls appropriate method to play animation
  #playSegmentHandler = (forceFlag) => {
    let frames = this.actions[this.interactionIdx].frames;

    // If using named markers
    if (typeof frames === 'string') {
      this.player.goToAndPlay(frames, forceFlag);
    } else {
      this.player.playSegments(frames, forceFlag);
    }
  }

  #chainedInteractionHandler = () => {
    let state = this.actions[this.interactionIdx].state;
    let transition = this.actions[this.interactionIdx].transition;
    let frames = this.actions[this.interactionIdx].frames;

    let stateFunction = this.stateHandler.get(state);
    let transitionFunction = this.transitionHandler.get(transition);

    if (stateFunction) {
      stateFunction.call();
    }
    if (transitionFunction) {
      transitionFunction.call();
    }

    if (this.player.autoplay) {
      this.player.resetSegments(true);
      this.#playSegmentHandler(true);
    }
  }

  #cursorHandler = (x, y) => {
    // Resolve cursor position if cursor is inside container
    if (x !== -1 && y !== -1) {
      // Get container cursor position
      const pos = this.getContainerCursorPosition(x, y);

      // Use the resolved position
      x = pos.x;
      y = pos.y;
    }

    // Find the first action that satisfies the current position conditions
    const action = this.actions.find(({ position }) => {
      if (position) {
        if (Array.isArray(position.x) && Array.isArray(position.y)) {
          return x >= position.x[0] && x <= position.x[1] && y >= position.y[0] && y <= position.y[1];
        } else if (!Number.isNaN(position.x) && !Number.isNaN(position.y)) {
          return x === position.x && y === position.y;
        }
      }

      return false;
    });

    // Skip if no matching action was found!
    if (!action) {
      return;
    }

    // Process action types:
    if (action.type === 'seek' || action.transition === 'seek') {
      //console.log("cursor synced");
      // Seek: Go to a frame based on player scroll position action
      const xPercent = (x - action.position.x[0]) / (action.position.x[1] - action.position.x[0]);
      const yPercent = (y - action.position.y[0]) / (action.position.y[1] - action.position.y[0]);

      this.player.playSegments(action.frames, true);

      if (action.position.y[0] < 0 && action.position.y[1] > 1) {
        this.player.goToAndStop(Math.floor(xPercent * this.player.totalFrames), true);
      } else {
        this.player.goToAndStop(Math.ceil(((xPercent + yPercent) / 2) * this.player.totalFrames), true);
      }
    } else if (action.type === 'loop') {
      this.player.playSegments(action.frames, true);
    } else if (action.type === 'play') {
      // Play: Reset segments and continue playing full animation from current position
      if (this.player.isPaused === true) {
        this.player.resetSegments();
      }
      this.player.playSegments(action.frames);
    } else if (action.type === 'stop') {
      // Stop: Stop playback
      this.player.goToAndStop(action.frames[0], true);
    }
  };

  #scrollHandler = () => {
    // Get container visibility percentage

    const currentPercent = this.getContainerVisibility();

    // Find the first action that satisfies the current position conditions
    const action = this.actions.find(
      ({ visibility }) => currentPercent >= visibility[0] && currentPercent <= visibility[1],
    );

    // Skip if no matching action was found!
    if (!action) {
      return;
    }

    // Process action types:
    if (action.type === 'seek') {
      // Seek: Go to a frame based on player scroll position action
      const start = action.frames[0];
      const end = action.frames.length == 2 ? action.frames[1] : (this.player.totalFrames - 1);

      // Use global frame reference for frames within the seek section.
      // Without this, if you follow a seek with a loop and then scroll back up,
      // it will treat frame numbers as relative to the loop.
      if (this.assignedSegment !== null) {
        this.player.resetSegments(true);
        this.assignedSegment = null;
      }

      this.player.goToAndStop(
        start + Math.round(
          ((currentPercent - action.visibility[0]) / (action.visibility[1] - action.visibility[0])) *
            (end - start)
        ),
        true,
      );
    } else if (action.type === 'loop') {
      this.player.loop = true;
      // Loop: Loop a given frames
      if (this.assignedSegment === null) {
        // if not playing any segments currently. play those segments and save to state
        this.player.playSegments(action.frames, true);
        this.assignedSegment = action.frames;
      } else {
        // if playing any segments currently.
        //check if segments in state are equal to the frames selected by action
        if (this.assignedSegment !== action.frames) {
          // if they are not equal. new segments are to be loaded
          this.player.playSegments(action.frames, true);
          this.assignedSegment = action.frames;
        } else {
          // if they are equal the play method must be called only if lottie is paused
          if (this.player.isPaused === true) {
            this.player.playSegments(action.frames, true);
            this.assignedSegment = action.frames;
          }
        }
      }
    } else if (action.type === 'play') {
      // Play: Reset segments and continue playing full animation from current position
      if (!this.scrolledAndPlayed) {
        this.scrolledAndPlayed = true;
        this.player.resetSegments(true);
        this.player.play();
      }
    } else if (action.type === 'stop') {
      // Stop: Stop playback
      this.player.goToAndStop(action.frames[0], true);
    }
  };
}

export const create = options => {
  const instance = new LottieInteractivity(options);
  instance.start();

  return instance;
};

export default create;
