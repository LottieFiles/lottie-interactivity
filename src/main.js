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
    }

    if (this.mode === 'cursor') {
      this.player.addEventListener('DOMLoaded', function () {
        Parentscope.player.loop = true;
        Parentscope.player.stop();
        Parentscope.container.addEventListener('mousemove', Parentscope.#mousemoveHandler);
        Parentscope.container.addEventListener('mouseout', Parentscope.#mouseoutHandler);
      });
    }
  }

  stop() {
    if (this.mode === 'scroll') {
      window.removeEventListener('scroll', this.#scrollHandler);
    }

    if (this.mode === 'cursor') {
      this.container.addEventListener('mousemove', this.#mousemoveHandler);
      this.container.addEventListener('mouseout', this.#mouseoutHandler);
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
      if (Array.isArray(position.x) && Array.isArray(position.y)) {
        return x >= position.x[0] && x <= position.x[1] && y >= position.y[0] && y <= position.y[1];
      } else if (!Number.isNaN(position.x) && !Number.isNaN(position.y)) {
        return x === position.x && y === position.y;
      }

      return false;
    });

    // Skip if no matching action was found!
    if (!action) {
      return;
    }

    // Process action types:
    if (action.type === 'seek') {
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
      this.player.goToAndStop(
        Math.ceil(
          ((currentPercent - action.visibility[0]) / (action.visibility[1] - action.visibility[0])) *
            (this.player.totalFrames - 1),
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
