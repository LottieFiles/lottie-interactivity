// Animation configuration

document.addEventListener("DOMContentLoaded", function () {
  LottieInteractivity.create({
    player: '#firstLottie',
    actions: [
      {
        start: 0,
        end: 1,
        type: "seek",
        frames: [0, 300],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#secondLottie',
    container: "MyContainerId",
    mode: "scroll",
    actions: [
      {
        start: 0,
        end: 1,
        type: "seek",
        frames: [0, 301],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#thirdLottie',
    mode: "scroll",
    actions: [
      {
        start: 0,
        end: 0.3,
        type: "stop",
        frames: [0],
      },
      {
        start: 0.3,
        end: 1,
        type: "seek",
        frames: [0, 301],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#fourthLottie',
    mode: "scroll",
    actions: [
      {
        start: 0,
        end: 0.2,
        type: "stop",
        frames: [0],
      },
      {
        start: 0.2,
        end: 0.45,
        type: "seek",
        frames: [0, 45],
      },
      {
        start: 0.45,
        end: 1.0,
        type: "loop",
        frames: [45, 60],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#fifthLottie',
    mode: "scroll",
    actions: [
      {
        start: 0,
        end: 1.0,
        type: "loop",
        frames: [17, 60],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#sixthLottie',
    actions: [
      {
        start: 0,
        end: 1.0,
        type: "hover",
        frames: [45, 60],
      },
    ],
  });

  // to setup on hover for segments. make sure the first frame is set as the frame you want to start the segment looping from
  const sixthLottie = document.getElementById("sixthLottie");
  sixthLottie.getLottie().goToAndStop(45, true);
});
