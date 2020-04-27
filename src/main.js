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

    this.player.loop = true;
    this.player.stop();
  }

  getContainerVisibility() {
    // Get the bounding box for the lottie player or container
    const { top, height } = this.container.getBoundingClientRect();

    // Calculate current view percentage
    const current = window.innerHeight - top;
    const max = window.innerHeight + height;
    return current / max;
  }

  getContanerCursorPosition(e) {
    const { top, left, width, height } = this.container.getBoundingClientRect();

    const x = ((e.clientX - left) / width).toFixed(2);
    const y = ((e.clientY - top) / height).toFixed(2);

    return { x, y };
  }

  start() {
    if (this.mode === 'scroll') {
      window.addEventListener('scroll', this.#scrollHandler);
    }

    if (this.mode === 'cursor') {
      this.player.goToAndStop(this.actions[0].frames[0], true);
      this.container.addEventListener('mousemove', this.#cursorHandler);
    }
  }

  stop() {
    if (this.mode === 'scroll') {
      window.removeEventListener('scroll', this.#scrollHandler);
    }

    if (this.mode === 'cursor') {
      this.container.removeEventListener('mousemove', this.#cursorHandler);
    }
  }

  #cursorHandler = e => {
    // Get container cursor position
    const { x, y } = this.getContanerCursorPosition(e);

    // console.log(x, y);

    // Find the first action that satisfies the current position conditions
    const action = this.actions.find(
      ({ position }) => x >= position.x[0] && x <= position.x[1] && y >= position.y[0] && y <= position.y[1],
    );

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
      this.player.goToAndStop(Math.ceil(((xPercent + yPercent) / 2) * this.player.totalFrames), true);
    } else if (action.type === 'loop') {
      if (this.player.isPaused === true) {
        this.player.playSegments(action.frames, true);
      }
    } else if (action.type === 'play') {
      // Play: Reset segments and continue playing full animation from current position
      if (this.player.isPaused === true) {
        this.player.resetSegments();
      }
      this.player.playSegments(action.frames);
    } else if (action.type === 'stop') {
      // Stop: Stop playback
      this.player.goToAndStop(action.frames[0]);
      this.player.stop();
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
      this.player.playSegments(action.frames, true);
      this.player.goToAndStop(
        Math.ceil(
          ((currentPercent - action.visibility[0]) / (action.visibility[1] - action.visibility[0])) *
            this.player.totalFrames,
        ),
        true,
      );
    } else if (action.type === 'loop') {
      // Loop: Loop a given frames
      if (this.player.isPaused === true) {
        this.player.playSegments(action.frames, true);
      }
    } else if (action.type === 'play') {
      // Play: Reset segments and continue playing full animation from current position
      if (this.player.isPaused === true) {
        this.player.resetSegments();
        this.player.play();
      }
    } else if (action.type === 'stop') {
      // Stop: Stop playback
      this.player.goToAndStop(action.frames[0]);
      this.player.stop();
    }
  };
}

export const create = options => {
  const instance = new LottieInteractivity(options);
  instance.start();

  return instance;
};

export default create;
