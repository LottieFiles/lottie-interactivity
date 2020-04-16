// Animation configuration

const animActions = {
  firstLottie: {
    actions: [
      {
        start: 0,
        end: 1,
        type: "seek",
        frames: [0, 300],
      },
    ],
  },
  secondLottie: {
    container: "MyContainerId",
    actions: [
      {
        start: 0,
        end: 1,
        type: "seek",
        frames: [0, 301],
      },
    ],
  },
  thirdLottie: {
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
  },
  fourthLottie: {
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
  },
  fifthLottie: {
    actions: [
      {
        start: 0,
        end: 1.0,
        type: "loop",
        frames: [17, 60],
      },
    ],
  },
  seventhLottie: {
    actions: [
      {
        start: 0,
        end: 1.0,
        type: "hover",
        frames: [45, 60],
      },
    ],
  },
};

document.addEventListener("DOMContentLoaded", function () {
  lottieInteractivity.lottieScroll(animActions);
  // to setup on hover for segments. make sure the first frame is set as the frame you want to start the segment looping from
  const MyLottie = document.getElementById("seventhLottie");
  MyLottie.getLottie().goToAndStop(45, true);
});
