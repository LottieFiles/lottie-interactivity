// Animation configuration

document.addEventListener('DOMContentLoaded', function () {
  // const lfcontainer = document.getElementById('fifthLottie');
  // const fifthLottie = lottie.loadAnimation({
  //   container: lfcontainer, // the dom element that will contain the animation
  //   renderer: 'svg',
  //   autoplay: false,
  //   path: 'https://assets2.lottiefiles.com/packages/lf20_4fET62.json', // the path to the animation json
  // });

  LottieInteractivity.create({
    player: '#zeroLottie',
    mode: 'scroll',
    actions: [
      {
        visibility: [0, 1.0],
        type: 'seek',
        frames: [0, 360],
      },
    ],
  });

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
    mode: 'scroll',
    container: '#MyContainerId',
    actions: [
      {
        visibility: [0, 1.0],
        type: 'seek',
        frames: [90, 123],
      },
    ],
  });

  // use the cursor sync and on frame 30 autoplay the rest
  // of the animation
  LottieInteractivity.create({
    player: '#unlockIphone',
    mode: 'chain',
    actions: [
      {
        state: 'none',
        position: { x: [0, 1], y: [-1, 2] },
        transition: 'seek',
        frames: [0, 30],
      },
      {
        state: 'autoplay',
        transition: 'none',
        frames: [30, 160],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#ninthLottie',
    mode: 'cursor',
    actions: [
      {
        position: { x: [0, 1], y: [-1, 2] },
        type: 'seek',
        frames: [0, 180],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#tenthLottie',
    mode: 'cursor',
    actions: [
      {
        type: 'click',
      },
    ],
  });

  LottieInteractivity.create({
    player: '#eleventhLottie',
    mode: 'cursor',
    actions: [
      {
        type: 'hover',
      },
    ],
  });

  LottieInteractivity.create({
    player: '#twelfthLottie',
    mode: 'scroll',
    actions: [
      {
        visibility: [0.50, 1.0],
        type: 'visible',
      },
    ],
  });

  LottieInteractivity.create({
    player: '#hoverTest',
    mode: 'chain',
    actions: [
      {
        transition: 'holdAndReverse',
        frames: [0, 125]
      },
      {
        transition: 'holdAndPause',
        frames: [125, 249],
        reset: true
      }]
  });

  LottieInteractivity.create({
    player: '#chainingPlayer',
    mode: 'chain',
    actions: [
      {
        state: 'loop',
        transition: 'click',
        frames: [0, 100]
      },
      {
        state: 'autoplay',
        transition: 'onComplete',
        frames: [100, 200]
      },
      {
        state: 'loop',
        loop: 1,
        transition: 'hover',
        frames: [200, 300]
      },
      {
        state: 'loop',
        transition: 'click',
        click: 4,
        frames: [300, 400],
        reset: false
      },
      {
        state: 'autoplay',
        transition: 'click',
        frames: [400, 500],
        reset: false
      },
      {
        state: 'loop',
        transition: 'repeat',
        repeat: 1,
        frames: [500, 600],
        reset: true
      }
    ]
  })

  LottieInteractivity.create({
    player: '#birdExploding',
    mode: 'chain',
    actions: [
      {
        state: 'loop',
        transition: 'click',
        frames: 'bird'
      },
      {
        state: 'autoplay',
        transition: 'onComplete',
        frames: 'explosion'
      },
      {
        state: 'autoplay',
        frames: 'feathers',
        reset: false
      }
    ],
  })

  LottieInteractivity.create({
    player: '#jumpToTest',
    mode: 'chain',
    actions: [
      {
        state: 'loop',
        transition: 'click',
        frames: [0, 100],
        jumpTo: 1
      },
      {
        state: 'autoplay',
        transition: 'onComplete',
        frames: [100, 200]
      },
      {
        state: 'loop',
        loop: 1,
        transition: 'hover',
        frames: [200, 300]
      },
      {
        state: 'loop',
        transition: 'click',
        click: 4,
        frames: [300, 400],
        reset: false
      },
      {
        state: 'autoplay',
        transition: 'click',
        frames: [400, 500],
        reset: false
      },
      {
        state: 'loop',
        transition: 'repeat',
        repeat: 1,
        frames: [500, 600],
        jumpTo: 3
      }
    ]
  })

  let listElem = document.getElementById('jumpToTest');
  listElem.addEventListener('transition', (e) => {
    console.log("Event captured: ");
    console.log(e.detail);
  });
});
