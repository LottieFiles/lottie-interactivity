// Animation configuration

document.addEventListener('DOMContentLoaded', function () {
  LottieInteractivity.create({
    player: '#firstLottie',
    mode: 'scroll',
    actions: [
      {
        start: 0,
        end: 1,
        type: 'seek',
        frames: [0, 300],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#secondLottie',
    container: 'MyContainerId',
    mode: 'scroll',
    actions: [
      {
        start: 0,
        end: 1,
        type: 'seek',
        frames: [0, 301],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#thirdLottie',
    mode: 'scroll',
    actions: [
      {
        start: 0,
        end: 0.3,
        type: 'stop',
        frames: [0],
      },
      {
        start: 0.3,
        end: 1,
        type: 'seek',
        frames: [0, 301],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#fourthLottie',
    mode: 'scroll',
    actions: [
      {
        start: 0,
        end: 0.2,
        type: 'stop',
        frames: [0],
      },
      {
        start: 0.2,
        end: 0.45,
        type: 'seek',
        frames: [0, 45],
      },
      {
        start: 0.45,
        end: 1.0,
        type: 'loop',
        frames: [45, 60],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#fifthLottie',
    mode: 'scroll',
    actions: [
      {
        start: 0,
        end: 1.0,
        type: 'loop',
        frames: [17, 60],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#seventhLottie',
    container: '#hover-container',
    mode: 'hover',
    actions: [
      {
        start: 0,
        end: 1.0,
        type: 'loop',
        frames: [60, 130],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#eightthLottie',
    container: '#hover-container2',
    mode: 'hover',
    actions: [
      {
        start: 0,
        end: 1.0,
        type: 'seek',
        frames: [0, 139],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#ninthLottie',
    container: '#hover-container3',
    mode: 'hover',
    actions: [
      {
        start: 0,
        end: 1.0,
        type: 'play',
        frames: [139, 0],
      },
    ],
  });
});
