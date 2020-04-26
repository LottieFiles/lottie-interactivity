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
  }

  start() {
    if (this.mode === 'scroll') {
      window.addEventListener('scroll', this.#scrollHandler);
    }

    if (this.mode === 'hover') {
      this.container.addEventListener('onmouseenter', this.#hoverStartHandler);
      this.container.addEventListener('onmouseleave', this.#hoverEndHandler);
    }
  }

  stop() {
    if (this.mode === 'scroll') {
      window.removeEventListener('scroll', this.#scrollHandler);
    }

    if (this.mode === 'hover') {
      this.container.removeEventListener('onmouseenter', this.#hoverStartHandler);
      this.container.removeEventListener('onmouseleave', this.#hoverEndHandler);
    }
  }

  #hoverStartHandler = () => {};

  #hoverEndHandler = () => {};

  #scrollHandler = () => {
    // Get the bounding box for the lottie player or container
    const { top, height } = this.container.getBoundingClientRect();

    // Calculate current view percentage
    const current = window.innerHeight - top;
    const max = window.innerHeight + height;
    const currentPercent = current / max;

    // // Skip if out of viewport
    if (currentPercent < 0 || currentPercent > 1) {
      return;
    }

    // Find the first action that satisfies the current position conditions
    const action = this.actions.find(({ start, end }) => currentPercent >= start && currentPercent <= end);

    // Skip if no matching action was found!
    if (!action) {
      return;
    }

    // Get lottie instance
    this.player.loop = true;

    // Process action types:
    if (action.type === 'seek') {
      // Seek: Go to a frame based on player scroll position action
      this.player.playSegments(action.frames, true);
      this.player.goToAndStop(
        Math.ceil(((currentPercent - action.start) / (action.end - action.start)) * this.player.totalFrames),
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
      }
      this.player.play();
    } else if (action.type === 'stop') {
      // Stop: Stop playback
      this.player.goToAndStop(action.frames[0]);
      this.player.stop();
      // TODO: This is not the way to implement this. Refactor needed!
    } else if (action.type === 'hover') {
      this.container.addEventListener('mouseenter', () => {
        if (this.player.isPaused === true) {
          this.player.playSegments(action.frames, true);
        }
      });
      this.container.addEventListener('mouseleave', () => {
        if (this.player.isPaused === false) {
          this.player.pause();
        }
      });
    }
  };
}

export const create = options => {
  const instance = new LottieInteractivity(options);
  instance.start();

  return instance;
};

export default create;
