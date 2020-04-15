/**
 * LottieFiles interactive scroll for Lottie
 *
 * @author Jawish Hameed <jawish@lottiefiles.com>
 *
 */
class LottieInteractivity {
  lottieScroll(config) {
    window.addEventListener("scroll", function () {
      for (const playerId in config) {
        // Get the lottie player element and lottie reference
        const player = document.getElementById(playerId);

        // Skip rest if the player element was not found
        if (!player) {
          console.log(
            `Invalid player element specified for ${playerId}. Skipping...`
          );
          continue;
        }

        // Get the configured container. Use player as fallback if unconfigured or invalid
        const container =
          "container" in config[playerId]
            ? document.querySelector(config[playerId].container)
            : player;

        // Skip rest if the container element was not found
        if (!container) {
          console.log(
            `Invalid container element specified for ${playerId}. Skipping...`
          );
          continue;
        }

        // Get the bounding box for the lottie player or container
        const { top, bottom, height } = container.getBoundingClientRect();

        // Calculate current view percentage
        const current = window.innerHeight - top;
        const max = window.innerHeight + height;
        const currentPercent = current / max;

        // // Skip if out of viewport
        if (currentPercent < 0 || currentPercent > 1) {
          continue;
        }

        // Find the first action that satisfies the current position conditions
        const action = config[playerId].actions.find(
          ({ start, end }) => currentPercent >= start && currentPercent <= end
        );

        // Skip if no matching action was found!
        if (!action) {
          continue;
        }

        // Get lottie instance
        const lottie = player.getLottie();
        lottie.loop = true;

        // Process action types:
        if (action.type === "seek") {
          // Seek: Go to a frame based on player scroll position action
          lottie.playSegments(action.frames, true);
          lottie.goToAndStop(
            Math.ceil(
              ((currentPercent - action.start) / (action.end - action.start)) *
                lottie.totalFrames
            ),
            true
          );
        } else if (action.type === "loop") {
          // Loop: Loop a given frames
          if (lottie.isPaused === true) {
            lottie.playSegments(action.frames, true);
          }
        } else if (action.type === "play") {
          // Play: Reset segments and continue playing full animation from current position
          if (lottie.isPaused === true) {
            lottie.resetSegments();
          }
          lottie.play();
        } else if (action.type === "stop") {
          // Stop: Stop playback
          lottie.goToAndStop(action.frames[0]);
          lottie.stop();
        }
      }
    });
  }
}
