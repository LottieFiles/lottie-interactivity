// Animation configuration

document.addEventListener('DOMContentLoaded', function () {
  LottieInteractivity.create({
    player: '#firstLottie',
    mode: 'scroll',
    actions: [
      {
        visibility: [0, 1.0],
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
        visibility: [0, 1.0],
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
        visibility: [0, 0.3],
        type: 'stop',
        frames: [0],
      },
      {
        visibility: [0.3, 1.0],
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
        visibility: [0, 0.2],
        type: 'stop',
        frames: [0],
      },
      {
        visibility: [0.2, 0.45],
        type: 'seek',
        frames: [0, 45],
      },
      {
        visibility: [0.45, 1.0],
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
        visibility: [0, 1.0],
        type: 'loop',
        frames: [17, 60],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#seventhLottie',
    container: '#hover-container',
    mode: 'cursor',
    actions: [
      {
        position: { x: [0, 1], y: [0, 1] },
        type: 'seek',
        frames: [1, 130],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#eightthLottie',
    container: '#hover-container2',
    mode: 'cursor',
    actions: [
      {
        position: { x: [0, 1], y: [0, 1] },
        type: 'loop',
        frames: [0, 139],
      },
    ],
  });
});
