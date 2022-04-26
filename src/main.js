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
    // Save the original player entered by user, used for interaction chaining / loading animations on the fly
    this.enteredPlayer = player;

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
        let message = ERROR_PREFIX + "Specified player:" + player + " is invalid.";

        throw new Error(message);
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
    this.loadedAnimation = this.player.path + this.player.fileName + ".json";
    this.attachedListeners = false;
    this.container = container;
    this.mode = mode;
    this.actions = actions;
    this.options = options;
    this.assignedSegment = null;
    this.scrolledAndPlayed = false;

    // Interaction chaining
    this.interactionIdx = 0;
    this.oldInterctionIdx = 0;
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

  initScrollMode() {
    this.player.stop();
    window.addEventListener('scroll', this.#scrollHandler, true);
  }

  initCursorMode() {
    // To have click and hover interaction, force to only have that type and single action
    // If there are multiple actions, click and hover are ignored
    if (this.actions &&
      this.actions.length === 1) {
      if (this.actions[0].type === "click") {
        this.player.loop = false;
        this.player.stop();
        this.container.addEventListener('click', this.#clickHoverHandler);
      } else if (this.actions[0].type === "hover") {
        this.player.loop = false;
        this.player.stop();
        this.container.addEventListener('mouseenter', this.#clickHoverHandler);

        // For mobile
        this.container.addEventListener('touchstart', this.#clickHoverHandler, { passive: true });
      } else if (this.actions[0].type === "toggle") {
        this.player.loop = false;
        this.player.stop();
        this.container.addEventListener('click', this.#toggleHandler);
      } else if (this.actions[0].type === "hold" || this.actions[0].type === "pauseHold") {
        this.container.addEventListener('mouseenter', this.#holdTransitionEnter);
        this.container.addEventListener('mouseleave', this.#holdTransitionLeave);

        // For mobile
        this.container.addEventListener('touchstart', this.#holdTransitionEnter, { passive: true });
        this.container.addEventListener('touchend', this.#holdTransitionLeave, { passive: true });

      } else if (this.actions[0].type === "seek") {
        this.player.loop = true;
        this.player.stop();
        this.container.addEventListener('mousemove', this.#mousemoveHandler);
        // For mobile
        this.container.addEventListener('touchmove', this.#touchmoveHandler, { passive: false });
        this.container.addEventListener('mouseout', this.#mouseoutHandler);
      }
    } else {
      this.player.loop = true;
      this.player.stop();
      this.container.addEventListener('mousemove', this.#mousemoveHandler);
      this.container.addEventListener('mouseleave', this.#mouseoutHandler);

      // Init the animations that set states when the cursor is outside the container, so that they
      // are visibly idle at the desired frame before first interaction with them
      this.#cursorHandler(-1, -1);
    }
  }

  initChainMode() {
    this.#initInteractionMaps();
    this.player.loop = false;
    this.player.stop();
    this.#chainedInteractionHandler({ ignorePath: false });
  }

  start() {
    if (this.mode === 'scroll') {
      if (this.player.isLoaded) {
        this.initScrollMode();
      } else {
        this.player.addEventListener('DOMLoaded', () => {
          this.initScrollMode();
        });
      }
    } else if (this.mode === 'cursor') {
      if (this.player.isLoaded) {
        this.initCursorMode();
      } else {
        this.player.addEventListener('DOMLoaded', () => {
          this.initCursorMode();
        });
      }
    } else if (this.mode === 'chain') {
      // When passing animation object to LI the player is already loaded
      if (this.player.isLoaded) {
        this.initChainMode();
      } else {
        this.player.addEventListener('DOMLoaded', () => {
          this.initChainMode();
        });
      }
    }
  }

  redefineOptions({ actions, container, mode, player, ...options }) {
    this.stop();

    // Save the original player entered by user, used for interaction chaining / loading animations on the fly
    this.enteredPlayer = player;

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
        let message = ERROR_PREFIX + "Specified player:" + player + " is invalid.";

        throw new Error(message, player);
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
    this.loadedAnimation = this.player.path + this.player.fileName + ".json";
    this.attachedListeners = false;
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
    this.holdStatus = null;
    this.stateHandler = new Map();
    this.transitionHandler = new Map();

    this.start();
  }

  stop() {
    if (this.mode === 'scroll') {
      window.removeEventListener('scroll', this.#scrollHandler, true);
    }

    if (this.mode === 'cursor') {
      this.container.removeEventListener('click', this.#clickHoverHandler);
      this.container.removeEventListener('click', this.#toggleHandler);
      this.container.removeEventListener('mouseenter', this.#clickHoverHandler);
      this.container.removeEventListener('touchstart', this.#clickHoverHandler);
      this.container.removeEventListener('touchmove', this.#touchmoveHandler);
      this.container.removeEventListener('mousemove', this.#mousemoveHandler);
      this.container.removeEventListener('mouseleave', this.#mouseoutHandler);
      this.container.removeEventListener('touchstart', this.#holdTransitionEnter);
      this.container.removeEventListener('touchend', this.#holdTransitionLeave);
    }

    if (this.mode === 'chain') {
      this.container.removeEventListener('click', this.#clickHoverHandler);
      this.container.removeEventListener('click', this.#clickHoverStateHandler);

      this.container.removeEventListener('mouseenter', this.#clickHoverHandler);
      this.container.removeEventListener('touchstart', this.#clickHoverHandler);
      this.container.removeEventListener('touchmove', this.#touchmoveHandler);
      this.container.removeEventListener('mouseenter', this.#clickHoverStateHandler);
      this.container.removeEventListener('touchstart', this.#clickHoverStateHandler);
      this.container.removeEventListener('mouseenter', this.#holdTransitionEnter);
      this.container.removeEventListener('touchstart', this.#holdTransitionEnter);

      this.container.removeEventListener('mouseleave', this.#holdTransitionLeave);
      this.container.removeEventListener('mousemove', this.#mousemoveHandler);
      this.container.removeEventListener('mouseout', this.#mouseoutHandler);
      this.container.removeEventListener('touchend', this.#holdTransitionLeave);

      if (this.player) {
        try {
          this.player.removeEventListener('loopComplete', this.#onCompleteHandler);
          this.player.removeEventListener('complete', this.#onCompleteHandler);
          this.player.removeEventListener('enterFrame', this.#cursorSyncHandler);
          this.player.removeEventListener('enterFrame', this.#holdTransitionHandler);
        } catch (e) {
          // User deleted the player before calling stop()
          // Ignore
        }
      }
    }
    this.player = null;
  }

  /**
   * [chain mode]
   * Init the state and transitions maps containing all the state and transition methods used for interaction chaining
   */
  #initInteractionMaps = () => {
    if (!this.player)
      return;

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
      this.container.addEventListener('click', this.#clickHoverStateHandler);
    }
    let hoverState = () => {
      this.player.loop = false;
      this.player.autoplay = false;
      this.container.addEventListener('mouseenter', this.#clickHoverStateHandler);
      // For mobile
      this.container.addEventListener('touchstart', this.#clickHoverStateHandler, { passive: true });
    }
    let clickTransition = () => {
      this.container.addEventListener('click', this.#clickHoverHandler);
    }
    let hoverTransition = () => {
      this.container.addEventListener('mouseenter', this.#clickHoverHandler);
      // For mobile
      this.container.addEventListener('touchstart', this.#clickHoverHandler, { passive: true });
    }
    let holdTransition = () => {
      this.player.addEventListener('enterFrame', this.#holdTransitionHandler);
      this.container.addEventListener('mouseenter', this.#holdTransitionEnter);
      this.container.addEventListener('mouseleave', this.#holdTransitionLeave);
      // For mobile
      this.container.addEventListener('touchstart', this.#holdTransitionEnter, { passive: true });
      this.container.addEventListener('touchend', this.#holdTransitionLeave, { passive: true });
    }
    let repeatTransition = () => {
      this.player.loop = true;
      this.player.autoplay = true;
      let handler = () => { this.#repeatTransition({ handler }) };
      this.player.addEventListener('loopComplete', handler);
    }
    let onCompleteTransition = () => {
      let state = this.actions[this.interactionIdx].state;

      if (state === 'loop')
        this.player.addEventListener('loopComplete', this.#onCompleteHandler);
      else
        this.player.addEventListener('complete', this.#onCompleteHandler);
    }
    let cursorSyncTransition = () => {
      this.player.stop();
      this.player.addEventListener('enterFrame', this.#cursorSyncHandler);
      this.container.addEventListener('mousemove', this.#mousemoveHandler);
      this.container.addEventListener('touchmove', this.#touchmoveHandler, { passive: false });
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

  /**
   * [chain mode]
   * Handle hover state on chained interactions
   */
  #clickHoverStateHandler = () => {
    let forceFlag = this.actions[this.interactionIdx].forceFlag;

    if (!forceFlag && this.player.isPaused === true) {
      this.#playSegmentHandler(true);
    } else if (forceFlag) {
      this.#playSegmentHandler(true);
    }
  }

  // [cursor mode]
  #toggleHandler = () => {
    if (this.clickCounter === 0) {
      this.player.play();
      this.clickCounter++;
    } else {
      this.clickCounter++;
      this.player.setDirection(this.player.playDirection * -1);
      this.player.play();
    }
  }

  /**
   * [cursor + chain mode]
   * Handle click and hover in both cursor and chain mode
   */
  #clickHoverHandler = () => {
    let forceFlag = this.actions[this.interactionIdx].forceFlag;
    let state = this.actions[this.interactionIdx].state;
    let transition = this.actions[this.interactionIdx].transition;

    // If we're in chain mode and the click or hover transition is used, otherwise just play the animation
    if (this.mode === 'chain') {
      // Check if there is a counter or not and make a transition
      if (this.actions[this.interactionIdx].count) {
        let clickLimit = parseInt(this.actions[this.interactionIdx].count);
        if (this.clickCounter < clickLimit - 1) {
          this.clickCounter += 1;
          return;
        }
      }
      // No click counter, so we remove the listeners and got to next interaction
      this.clickCounter = 0;
      // Transition when the animation has finished playing
      if (!forceFlag && (transition === "click" && state === "click") || (transition === "hover" && state === "hover"))
        this.transitionHandler.get("onComplete").call();
      else
        this.nextInteraction();
      this.container.removeEventListener('click', this.#clickHoverHandler);
      this.container.removeEventListener('mouseenter', this.#clickHoverHandler);
      return;
    }
    // Using goToAndPlay rather than this.#playSegmentHandler(forceFlag) because we're in cursor mode
    // there for we want to play from the beginning
    if (!forceFlag && this.player.isPaused === true) {
      this.player.goToAndPlay(0, true);
    } else if (forceFlag) {
      this.player.goToAndPlay(0, true);
    }
  }

  // [cursor mode]
  #mousemoveHandler = e => {
    this.#cursorHandler(e.clientX, e.clientY);
  };

  // [cursor mode]
  #touchmoveHandler = e => {
    // Allows for syncing on Y axis without scrolling the page
    if (e.cancelable)
      e.preventDefault();
    this.#cursorHandler(e.touches[0].clientX, e.touches[0].clientY);
  };

  // [cursor mode]
  #mouseoutHandler = () => {
    this.#cursorHandler(-1, -1);
  };


  /**
   * [chain mode]
   * Handle when a segment of the animation has finished playing
   */
  #onCompleteHandler = () => {
    if (this.actions[this.interactionIdx].state === 'loop') {
      this.player.removeEventListener('loopComplete', this.#onCompleteHandler);
    } else {
      this.player.removeEventListener('complete', this.#onCompleteHandler);
    }
    this.nextInteraction();
  }

  // [chain mode]
  #repeatTransition = ({ handler }) => {
    let repeatAmount = 1;

    if (this.actions[this.interactionIdx].repeat)
      repeatAmount = this.actions[this.interactionIdx].repeat;
    if (this.playCounter >= repeatAmount - 1) {
      this.playCounter = 0;
      this.player.removeEventListener('loopComplete', handler);
      this.player.loop = false;
      this.player.autoplay = false;
      this.nextInteraction();
    } else {
      this.playCounter += 1;
    }
  }

  /**
   * [chain mode]
   * TODO: How does this work with markers? Get marker duration?
   */
  #cursorSyncHandler = () => {
    let frames = this.actions[this.interactionIdx].frames;

    if (frames && this.player.currentFrame >= parseInt(frames[1]) - 1) {
      this.player.removeEventListener('enterFrame', this.#cursorSyncHandler);
      this.container.removeEventListener('mousemove', this.#mousemoveHandler);
      this.container.removeEventListener('mouseout', this.#mouseoutHandler);
      setTimeout(this.nextInteraction, 0);
    }
  }

  /**
   * [chain mode]
   * TODO: How does this work with markers? Get marker duration?
   *
   * With the hold transition we can't use playSegment so we have to manually verify if
   * The user held long enough and check if the current frame is within the segment limits
   *
   */
  #holdTransitionHandler = () => {
    let frames = this.actions[this.interactionIdx].frames;

    if ((frames && this.player.currentFrame >= frames[1]) || (this.player.currentFrame >= this.player.totalFrames - 1)) {
      this.player.removeEventListener('enterFrame', this.#holdTransitionHandler);
      this.container.removeEventListener('mouseenter', this.#holdTransitionEnter);
      this.container.removeEventListener('mouseleave', this.#holdTransitionLeave);
      // For mobile
      this.container.removeEventListener('touchstart', this.#holdTransitionEnter, { passive: true });
      this.container.removeEventListener('touchend', this.#holdTransitionLeave, { passive: true });
      this.player.pause();

      this.holdStatus = false;
      this.nextInteraction();
    }
  }

  // [cursor + chain mode]
  #holdTransitionEnter = () => {
    // On first cursor enter needs check
    if (this.player.playDirection === -1 || this.holdStatus === null || !this.holdStatus) {
      this.player.setDirection(1);
      this.player.play();
      this.holdStatus = true;
    }
  }

  // [cursor + chain mode]
  #holdTransitionLeave = () => {
    if (this.actions[this.interactionIdx].transition === "hold" || this.actions[0].type === "hold") {
      this.player.setDirection(-1);
      this.player.play();
    } else if (this.actions[this.interactionIdx].transition === "pauseHold" || this.actions[0].type === "pauseHold") {
      this.player.pause();
    }
    this.holdStatus = false;
  }

  // [chain mode]
  #clearStateListeners = () => {
    let state = this.actions[this.interactionIdx].state;
    let transition = this.actions[this.interactionIdx].transition;

    if (state === "hover" || state === "click") {
      this.container.removeEventListener('click', this.#clickHoverStateHandler);
      this.container.removeEventListener('mouseenter', this.#clickHoverStateHandler);
    }
    if (transition === "hover" || transition === "click") {
      this.container.removeEventListener('click', this.#clickHoverHandler);
      this.container.removeEventListener('mouseenter', this.#clickHoverHandler);
      this.container.removeEventListener('touchstart', this.#clickHoverHandler, { passive: true });
    }
  }

  jumpToInteraction = (index) => {
    this.#clearStateListeners();
    this.interactionIdx = index;
    this.interactionIdx < 0 ? this.interactionIdx = 0 : this.interactionIdx;
    this.nextInteraction(false);
  }

  // [chain mode]
  nextInteraction = (incrementIndex = true) => {
    this.oldInterctionIdx = this.interactionIdx;
    // If state is hover or click we need to remove listeners
    this.#clearStateListeners();

    // Check if theres a jump-to before incrementing
    let jumpToIndex = this.actions[this.interactionIdx].jumpTo;
    if (jumpToIndex) {
      // If jumpToIndex is inside action length jump to it otherwise go to first action
      if (jumpToIndex >= 0 && jumpToIndex < this.actions.length) {
        this.interactionIdx = jumpToIndex;
        this.#chainedInteractionHandler({ ignorePath: false });
      } else {
        this.interactionIdx = 0;
        this.player.goToAndStop(0, true);
        this.#chainedInteractionHandler({ ignorePath: false });
      }
    } else {
      // Go to next interaction
      if (incrementIndex)
        this.interactionIdx++;
      if (this.interactionIdx >= this.actions.length) {
        // Go back to the first interaction
        if (this.actions[this.actions.length - 1].reset) {
          this.interactionIdx = 0;
          this.player.resetSegments(true);
          if (this.actions[this.interactionIdx].frames)
            this.player.goToAndStop(this.actions[this.interactionIdx].frames, true);
          else
            this.player.goToAndStop(0, true);
          this.#chainedInteractionHandler({ ignorePath: false });
        }
        else {
          this.interactionIdx = this.actions.length - 1;
          this.#chainedInteractionHandler({ ignorePath: false });
        }
      } else {
        this.#chainedInteractionHandler({ ignorePath: false });
      }
    }

    // Emit event from the lottie-player element
    this.container.dispatchEvent(new CustomEvent("transition", {
      bubbles: true,
      composed: true,
      detail: { oldIndex: this.oldInterctionIdx, newIndex: this.interactionIdx }
    }));
  }

  /**
   * [chain mode]
   * Checks if frames are an array or string, and calls appropriate method to play animation
   */
  #playSegmentHandler = (forceFlag) => {
    let frames = this.actions[this.interactionIdx].frames;

    //If no frame segment is defined, play the whole animation
    if (!frames) {
      this.player.resetSegments(true);
      this.player.goToAndPlay(0, true);
      return;
    }
    // If using named markers
    if (typeof frames === 'string') {
      this.player.goToAndPlay(frames, forceFlag);
    } else {
      this.player.playSegments(frames, forceFlag);
    }
  }

  /**
   * [chain mode]
   * Load a new animation using the path defined in the current interaction
   */
  #loadAnimationInChain = () => {
    let path = this.actions[this.interactionIdx].path;

    // The animation path declared on the lottie-player was saved in the constructor under 'enteredPlayer'
    // We assume that the path on the lottie-player element is the animation to use in the first action
    if (!path) {
      // If we passed animationData to Lottie-Interactivity, load the animation data otherwise use the path
      if (typeof this.enteredPlayer === 'object' && this.enteredPlayer.constructor.name === 'AnimationItem') {
        path = this.enteredPlayer;

        if (this.player === path) {
          this.#chainedInteractionHandler({ ignorePath: true });
          return;
        }
      } else {
        path = this.loadedAnimation;
        let fileName = path.substr(path.lastIndexOf('/') + 1);
        fileName = fileName.substr(0, fileName.lastIndexOf('.json'));

        // Prevents reloading animation the same animation
        if (this.player.fileName === fileName) {
          this.#chainedInteractionHandler({ ignorePath: true });
          return;
        }
      }
    }

    // Force width and height on the container to retain its size while the next animation is being loaded
    let lottieContainerSize = this.container.getBoundingClientRect();
    let newContainerStyle = "width: " + lottieContainerSize.width + "px !important; height: " +
      lottieContainerSize.height + "px !important; background: " + this.container.style.background;
    this.container.setAttribute('style', newContainerStyle);

    if (!(typeof this.enteredPlayer === 'object' && this.enteredPlayer.constructor.name === 'AnimationItem')) {
      if (typeof this.enteredPlayer === 'string') {
        const elem = document.querySelector(this.enteredPlayer);

        if (elem && elem.nodeName === LOTTIE_PLAYER_NODE) {
          // Prevents adding the listeners multiple times if multiple animations are needed to be loaded from actions
          if (!this.attachedListeners) {
            // Remove the styling that prevents flickering
            elem.addEventListener("ready", () => {
              this.container.style.width = '';
              this.container.style.height = '';
            });
            elem.addEventListener("load", () => {
              this.player = elem.getLottie();
              this.#chainedInteractionHandler({ ignorePath: true });
            });
            this.attachedListeners = true;
          }
          // The LottieFiles player destroys the animation when a new one is Loaded
          elem.load(path);
        }
      } else if (this.enteredPlayer instanceof HTMLElement && this.enteredPlayer.nodeName === LOTTIE_PLAYER_NODE) {
        // Prevents adding the listeners multiple times if multiple animations are needed to be loaded from actions
        if (!this.attachedListeners) {
          // Remove the styling that prevents flickering
          this.enteredPlayer.addEventListener("ready", () => {
            this.container.style.width = '';
            this.container.style.height = '';
          });
          this.enteredPlayer.addEventListener("load", () => {
            this.player = this.enteredPlayer.getLottie();
            this.#chainedInteractionHandler({ ignorePath: true });
          });
          this.attachedListeners = true;
        }
        // The LottieFiles player destroys the animation when a new one is Loaded
        this.enteredPlayer.load(path);
      }
      // Throw error no player instance has been successfully resolved
      if (!this.player) {
        throw new Error(`${ERROR_PREFIX} Specified player is invalid.`, this.enteredPlayer);
      }
    } else {
      if (window.lottie) {
        this.stop();
        this.player.destroy();
        // Removes svg animation contained inside
        this.container.innerHTML = "";

        if (typeof path === 'object' && path.constructor.name === 'AnimationItem') {
          this.player = window.lottie.loadAnimation({
            loop: false,
            autoplay: false,
            animationData: path.animationData,
            container: this.container
          });
        }
        else {
          this.player = window.lottie.loadAnimation({
            loop: false,
            autoplay: false,
            path,
            container: this.container
          });
        }

        this.player.addEventListener('DOMLoaded', () => {
          // Remove the styling that prevents flickering
          this.container.style.width = '';
          this.container.style.height = '';
          this.#chainedInteractionHandler({ ignorePath: true });
        });
      } else {
        throw new Error(`${ERROR_PREFIX} A Lottie player is required.`);
      }
    }
    // Reset counters
    this.clickCounter = 0;
    this.playCounter = 0;
  }

  /**
   * [chain mode]
   * Check the action object at the current interaction index and set the needed interaction listeners as well
   * as any extra options
   */
  #chainedInteractionHandler = ({ ignorePath }) => {
    let frames = this.actions[this.interactionIdx].frames;
    let state = this.actions[this.interactionIdx].state;
    let transition = this.actions[this.interactionIdx].transition;
    let path = this.actions[this.interactionIdx].path;
    let stateFunction = this.stateHandler.get(state);
    let transitionFunction = this.transitionHandler.get(transition);
    let speed = this.actions[this.interactionIdx].speed ? this.actions[this.interactionIdx].speed : 1;
    let delay = this.actions[this.interactionIdx].delay ? this.actions[this.interactionIdx].delay : 0;

    // Check if path is detected or that we are at the beginning again and reset
    // If we are back at the first action, we need to reload the animation declared on the lottie-player element
    if (!ignorePath && (path || (this.actions[this.actions.length - 1].reset && this.interactionIdx === 0))) {
      this.#loadAnimationInChain();
      return;
    }
    setTimeout(() => {
      if (frames) {
        this.player.autoplay = false;
        this.player.resetSegments(true);
        this.player.goToAndStop(frames[0], true);
      }
      if (stateFunction) {
        stateFunction.call();
      } else if (state === "none") {
        this.player.loop = false;
        this.player.autoplay = false;
      }
      if (transitionFunction) {
        transitionFunction.call();
      }
      if (this.player.autoplay) {
        this.player.resetSegments(true);
        this.#playSegmentHandler(true);
      }
      this.player.setSpeed(speed);
    }, delay);
  }

  // [cursor mode]
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
      this.player.resetSegments(true);
      // Stop: Stop playback
      this.player.goToAndStop(action.frames[0], true);
    }
  };

  // [scroll mode]
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
        if (action.frames) {
          this.player.playSegments(action.frames, true);
        } else {
          this.player.play();
        }
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
