// Animation configuration

document.addEventListener('DOMContentLoaded', function () {
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

  LottieInteractivity.create({
    player: '#thirdLottie',
    mode: 'scroll',
    actions: [
      {
        visibility: [0, 0.3],
        type: 'stop',
        frames: [50],
      },
      {
        visibility: [0.3, 1.0],
        type: 'seek',
        frames: [50, 240],
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
        frames: [70, 500],
      },
    ],
  });

  LottieInteractivity.create({
    player: '#seventhLottie',
    mode: 'cursor',
    actions: [
      {
        position: { x: [0, 1], y: [0, 1] },
        type: 'loop',
        frames: [45, 60],
      },
      {
        position: { x: -1, y: -1 },
        type: 'stop',
        frames: [0],
      }]
  });

  LottieInteractivity.create({
    player: '#eighthLottie',
    mode: 'cursor',
    actions: [
      {
        position: { x: [0, 1], y: [0, 1] },
        type: "seek",
        frames: [0, 280]
      }
    ]
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
        forceFlag: false
      },
    ],
  });

  LottieInteractivity.create({
    player: '#eleventhLottie',
    mode: 'cursor',
    actions: [
      {
        type: 'hover',
        forceFlag: false
      },
    ],
  });

  LottieInteractivity.create({
    player: '#toggleLottie',
    mode: 'cursor',
    actions: [
      {
        type: 'toggle'
      }
    ]
  });

  LottieInteractivity.create({
    player:'#twelfthLottie',
    mode:"scroll",
    actions: [
      {
        visibility: [0.50, 1.0],
        type: "play"
      },
    ]
  });

  LottieInteractivity.create({
    player: '#thirteenthLottie',
    mode: 'cursor',
    actions: [
      {
        type: 'hold'
      }]
  });

  LottieInteractivity.create({
    player: '#fourteenthLottie',
    mode: 'cursor',
    actions: [
      {
        type: 'pauseHold'
      }]
  });

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
        transition: 'onComplete',
        reset: true
      }
    ],
  })

  LottieInteractivity.create({
    player: '#clickPlayer',
    mode: 'chain',
    actions: [
      {
        state: 'click',
        forceFlag: true,
        transition: 'click',
        count: 5
      },
      {
        path: 'https://assets1.lottiefiles.com/packages/lf20_ISbOsd.json',
        state: 'autoplay',
        reset: true,
        transition: 'onComplete'
      }
    ]
  });

  LottieInteractivity.create({
    player: '#hoverPlayer',
    mode: 'chain',
    actions: [
      {
        state: 'hover',
        forceFlag: true,
        transition: 'hover',
        count: 5
      },
      {
        path: 'https://assets1.lottiefiles.com/packages/lf20_ISbOsd.json',
        state: 'autoplay',
        reset: true,
        transition: 'onComplete'
      }
    ]
  });

  LottieInteractivity.create({
    player: '#repeatPlayer',
    mode: 'chain',
    actions: [
      {
        state: 'autoplay',
        transition: 'repeat',
        repeat: 2
      },
      {
        path: 'https://assets2.lottiefiles.com/packages/lf20_2m1smtya.json',
        state: 'autoplay',
        frames: [0, 110],
        transition: 'onComplete',
        reset: true,
      }
    ]
  });

  LottieInteractivity.create({
    player: '#holdPlayer',
    mode: 'chain',
    actions: [
      {
        state: 'none',
        transition: 'hold',
        frames: [0, 170]
      },
      {
        path: 'https://assets4.lottiefiles.com/packages/lf20_7zara4iv.json',
        state: 'autoplay',
        transition: 'onComplete',
        reset: true
      }
    ]
  });

  LottieInteractivity.create({
    player: '#pauseHoldPlayer',
    mode: 'chain',
    actions: [
      {
        state: 'none',
        transition: 'pauseHold',
        frames: [0, 170]
      },
      {
        path: 'https://assets4.lottiefiles.com/packages/lf20_7zara4iv.json',
        state: 'autoplay',
        transition: 'onComplete',
        reset: true
      }
    ]
  });

  // use the cursor sync and on frame 30 autoplay the rest
  // of the animation
  LottieInteractivity.create({
    player: '#syncPlayer',
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
    player: '#chainLoadPlayer',
    mode: 'chain',
    actions: [
      {
        state: 'click',
        transition: 'onComplete'
      },
      {
        state: 'autoplay',
        transition: 'onComplete',
        path: 'https://assets6.lottiefiles.com/packages/lf20_opn6z1qt.json'
      },
      {
        state: 'autoplay',
        transition: 'onComplete',
        path: 'https://assets9.lottiefiles.com/packages/lf20_pKiaUR.json',
        reset: true
      }
    ]
  });

  LottieInteractivity.create({
    player: '#jumpToPlayer',
    mode: 'chain',
    actions: [
      {
        state: 'click',
        frames: 'circle',
        transition: 'onComplete',
      },
      {
        state: 'autoplay',
        frames: 'triangle',
        transition: 'onComplete',
      },
      {
        state: 'autoplay',
        frames: 'square',
        transition: 'onComplete',
      },
      {
        state: 'autoplay',
        frames: 'brocolli',
        transition: 'onComplete',
        jumpTo: 1
      },
    ]
  });
});
