const DEFAULT_OPTIONS = {
  player: 'lottie-player',
};
const LOTTIE_PLAYER_NODE = 'LOTTIE-PLAYER';
const ERROR_PREFIX = '[lottieInteractivity]:';

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
})();

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

    this.currentTime = 0;
    this.handler = null;
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
        Parentscope.player.loop = true;
        Parentscope.player.stop();
        //Parentscope.#moveToFrame(0, 2);
        console.log("starting");
        Parentscope.#animate();
        //Parentscope.#tweenHandler(300, 15);
        //Parentscope.#toAnimate();
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

  bounce(timeFraction) {
    for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
      if (timeFraction >= (7 - 4 * a) / 11) {
        return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
      }
    }
  }

  powerOfN(timeFraction, n) {
    return (Math.pow(timeFraction, n));
  }

  arc(timeFraction) {
    return (1 - Math.sin(Math.acos(timeFraction)));
  }

  /**
   * Todo: Use this from scrollHandler, add debounce on scroller and cancel the on-going easing
   * @param start
   * @param duration
   * @param handler
   */
  #animateLoop = (start, duration, handler) => {
    let time = performance.now();
    let progress;

    // timeFraction goes from 0 to 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

  /**
   * Can swap out for different easing functions here
   */
  progress = this.bounce(timeFraction);

    //progress is the progress of the animation --> 5% of totalDuration for ex
    let targetFrame = this.player.totalFrames * ( progress );
    this.player.goToAndStop(targetFrame, true);

    if (targetFrame >= this.player.totalFrames)
      clearInterval(handler);
    // if (timeFraction < 1) {
    //   requestAnimationFrame(this.#animateLoop);
    // }
  }

  #animate = () => {
    let start = performance.now();

    let handler = setInterval(() => this.#animateLoop(start, 5000, handler), 1000 / 60);
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

  #easeLinear = (time, startValue, change, duration) => {
    // console.log("time : " + time);
    // console.log("startValue : " + startValue);
    // console.log("change : " + change);
    // console.log("duration : " + duration);

   return change * time / duration + startValue;
  }

  #easeInQuad = (time, startValue, change, duration) => {
    console.log("time : " + time);
    console.log("startValue : " + startValue);
    console.log("change : " + change);
    console.log("duration : " + duration);

    return change * (time /= duration) * time + startValue;
  }

  #quadEase = (time, startValue, change, duration) => {
    console.log("time : " + time);
    console.log("startValue : " + startValue);
    console.log("change : " + change);
    console.log("duration : " + duration);

    time /= duration / 2;
    if (time < 1)  {
      return change / 2 * time * time + startValue;
    }

    time--;
    return -change / 2 * (time * (time - 2) - 1) + startValue;
  };

  #debounce = (callback, wait) => {
    let timeout;
    console.log("returning..");
    return function() {
      console.log("returned");
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => {callback.apply(context, args)}, wait);
    };
  }

  // #debounce = (func, timeout = 300) => {
  //   console.log("IN DEBOUNCE");
  //   let timer;
  //   return (...args) => {
  //     console.log("Clearing timeout");
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       func.apply(...args);
  //       }, timeout);
  //   };
  // }

  #saveInput = (newFrame) => {
    console.log("SETTING FRAME");

    this.player.goToAndStop(
      newFrame,
      true,
    );
  }

  #toAnimate = () => {
    //let start = Date.now(); // remember start time
    let start = performance.now();

    let timer = setInterval(() => {
      // how much time passed from the start?
      let timePassed = performance.now() - start;

      //let duration = this.player.getDuration(false);
      let duration = 5;
      console.log("DURATION : " + duration);

      let timeFraction = timePassed / duration;
      if (timeFraction > 1) timeFraction = 1;
      console.log("time fraction : " + timeFraction);
      console.log("time passed : " + timePassed);

      //let easing = 1 - Math.cos((timeFraction * Math.PI) / 2);
      let progress = 1 - Math.sin(Math.acos(timeFraction));

      if (timePassed >= 10000) {
        clearInterval(timer); // finish the animation after 2 seconds
        return;
      }

      // draw the animation at the moment timePassed
      this.player.goToAndStop(progress, true);

    }, 20);
  }

  #tick = (currentFrame, currentTime, time, targetFrame) => {
    console.log("CT : " + this.currentTime);
    console.log("time : " + time);
    this.currentTime += 1 / 60;

    let p = this.currentTime / time;
    //EaseinoutSine

    let easing = (-0.5 * (Math.cos(Math.PI * p) - 1));

    //let easing =  Math.sin(p * (Math.PI / 2));
    //let easing = this.#easeInOutQuad(this.currentTime * 100 / 2, this.currentTime, currentFrame, targetFrame, 2);


    // if ((p /= 0.5) < 1) {
    //   easing =  0.5 * Math.pow(p, 5);
    // } else
    //   easing = 0.5 * (Math.pow((p - 2), 5) + 2);

    //console.log("T : " + easing);
    //var t = easingEquations[easing](p);
    //let t = this.#easeInQuad(this.player.currentFrame / this.player.totalFrames, this.player.currentFrame, this.player.currentFrame - targetFrame, 5);
    //let t = this.#easeLinear(t, this.player.currentFrame, this.player.currentFrame - this.player.currentFrame, 5);
    if (p < 1) {
      this.player.goToAndStop(currentFrame + ((targetFrame - currentFrame) * easing), true);
      //requestAnimFrame(() => this.#tick(currentFrame, currentTime, time, targetFrame));
//      let newFrame = this.#easeLinear(p, this.player.currentFrame, targetFrame - this.player.currentFrame, 2);
//      this.player.goToAndStop(newFrame, true);
    } else {
      console.log('scroll done');
      this.currentTime = 0;
      clearInterval(this.handler);
      //this.player.goToAndStop(targetFrame, true);
    }
    return currentTime;
  }

  #tweenHandler = (targetFrame, speed) => {
    let currentTime = 0;
    const currentPercent = this.getContainerVisibility();
    //let currentFrame = (Math.floor(currentPercent *  (this.player.totalFrames - 1)));
    let currentFrame = this.player.currentFrame;

    let time = Math.max(.1, Math.min(Math.abs(currentFrame - targetFrame) / speed, .8));
    //currentTime = this.#tick(currentTime, time, targetFrame);

    // function tick() {
    //   currentTime += 1 / 60;
    //
    //   let p = currentTime / time;
    //   //var t = easingEquations[easing](p);
    //   let t = this.#easeLinear(t, this.player.currentFrame, this.player.currentFrame - this.player.currentFrame, 2);
    //
    //   if (p < 1) {
    //     window.requestAnimFrame(() => { tick });
    //     this.player.goToAndStop(this.player.currentFrame + ((targetFrame - this.player.currentFrame) * t), true);
    //     //window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
    //   } else {
    //     console.log('scroll done');
    //     this.player.goToAndStop(targetFrame, true);
    //   }
    // }
    // tick();
    // this.#tick(currentFrame, currentTime, time, targetFrame);

    if (this.handler) {
      this.currentTime = 0;
      clearInterval(this.handler);
    }
    else
      this.handler = setInterval(() => this.#tick(currentFrame, currentTime, time, targetFrame), 1000 / 60);
  }

  #easeInOutQuad = (x, t, b, c, d) => {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b;
    } else {
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
  }

  #move = (time, fps, duration, start, finish, position, handler) => {
    console.log("start: " + start);
    console.log("finish: " + finish);
    // console.log("distance: " + distance);
    // console.log("increment: " + increment);

    //position += increment;
    time += 1 / fps;
    position = this.#easeInOutQuad(time * 100 / duration, time, start, finish, duration);

    if (position >= finish) {
      clearInterval(handler);
      this.player.goToAndStop(finish, true)
      //box.style.left = finish + "px";
      //return;
    } else {
      console.log("MOVING : " + position * 100);
      this.player.goToAndStop(position * 100, true)
    }
    //box.style.left = position + "px";
  }

  #moveToFrame = (targetFrame, speed) => {
    const currentPercent = this.getContainerVisibility();

    let fps = 60,
      duration = 2, // seconds
      start = 0, // pixel
      //start = 0,
      finish = 300,
      distance = finish - start,
      increment = distance / (duration * fps),
      position = start,
      time = 0,
      handler = setInterval(() => this.#move(time, fps, duration, start, finish, position, handler), 1000 / fps);
  }

  #scrollHandler = () => {
    // this.#callScrollToY();
    // return ;
    // Get container visibility percentage

    //From scroll event handler
    const currentPercent = this.getContainerVisibility();

    // Find the first action that satisfies the current position conditions
    const action = this.actions.find(
      ({ visibility }) => currentPercent >= visibility[0] && currentPercent <= visibility[1],
    );

    // Skip if no matching action was found!
    if (!action) {
      return;
    }
    // let oldFrameMethod = Math.ceil(
    //   ((currentPercent - action.visibility[0]) / (action.visibility[1] - action.visibility[0])) *
    //   this.player.totalFrames,
    //   );

    // Process action types:
    if (action.type === 'seek') {
      // Seek: Go to a frame based on player scroll position action
      let frame = Math.ceil(
        ((currentPercent - action.visibility[0]) / (action.visibility[1] - action.visibility[0])) *
        this.player.totalFrames,
        );

      let t = this.player.currentFrame / this.player.totalFrames;
      //let newFrame = this.#easeInQuad(t, this.player.currentFrame, frame, 4);
      //let newFrame = this.#easeLinear(t, this.player.currentFrame, frame - this.player.currentFrame, 2);
      //let newFrame = this.#easeInQuad(t, this.player.currentFrame, frame - this.player.currentFrame, 2);


      /**
       * Was trying to use this to reproduce what gsap does
       */
      //this.#tweenHandler(frame, 1500);
      /**
       * 2 seconds
       */

      //this.#moveToFrame(frame, 2);

      // var dx = frame - this.player.currentFrame;
      // var vx = dx * 0.1;
      // var newFrame = this.player.currentFrame;
      // newFrame += vx;
      //
      // this.player.goToAndStop(
      //   newFrame,
      //   true,
      // );

/*
      if (newFrame < 1) {
        console.log("FRAME < 1");
        newFrame = frame;
      }
      else if (newFrame >= this.player.totalFrames) {
        console.log("FRAME NUM IS TOO BIG");
        newFrame = 0;
      }
*/


      /**
       * To reproduce
       */
      // let timeObj = {currentFrame: this.player.currentFrame}
      // gsap.to(timeObj, {
      //   duration: 4,
      //   currentFrame: (Math.floor(currentPercent *  (this.player.totalFrames - 1))),
      //   onUpdate: () => {
      //     this.player.goToAndStop(timeObj.currentFrame, true)
      //   },
      //   ease: 'expo'
      // });


      //this.#debounce(() => {scope.#saveInput(newFrame)}, 500);


      // this.player.goToAndStop(
      //   newFrame,
      //   true,
      // );

    } else if (action.type === 'loop') {
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
      if (this.player.isPaused === true) {
        this.player.resetSegments();
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
