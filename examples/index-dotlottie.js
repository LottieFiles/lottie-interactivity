// Animation configuration
document.addEventListener('DOMContentLoaded', function () {
  let zeroLottie = document.getElementById("zeroLottie");
  let zeroLottieData;

  zeroLottie.addEventListener('ready', () => {
    zeroLottieData = zeroLottie.getLottie();
    LottieInteractivity.create({
      player: zeroLottieData,
      mode: 'scroll',
      actions: [
        {
          visibility: [0, 1.0],
          type: 'seek',
          frames: [0, 360],
        },
      ],
    });

  })

  console.log(zeroLottie)

  // LottieInteractivity.create({
  //   player: '#zeroLottie',
  //   mode: 'scroll',
  //   actions: [
  //     {
  //       visibility: [0, 1.0],
  //       type: 'seek',
  //       frames: [0, 360],
  //     },
  //   ],
  // });

  console.log('one')

  let firstLottie = document.getElementById("firstLottie");
  firstLottie.addEventListener('ready', () => {
    let firstLottieData;
    firstLottieData = firstLottie.getLottie();
    LottieInteractivity.create({
      player: firstLottieData,
      mode: 'scroll',
      actions: [
        {
          visibility: [0, 1.0],
          type: 'seek',
          frames: [0, 300],
        },
      ],
    });
  })

  let secondLottie = document.getElementById("secondLottie");
  secondLottie.addEventListener('ready', () => {
    let secondLottieData;
    secondLottieData = secondLottie.getLottie();
    LottieInteractivity.create({
      player: secondLottieData,
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
  })

  let thirdLottie = document.getElementById("thirdLottie");
  thirdLottie.addEventListener('ready', () => {
    let thirdLottieData;
    thirdLottieData = thirdLottie.getLottie();
    LottieInteractivity.create({
      player: thirdLottieData,
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
  })

  let fourthLottie = document.getElementById("fourthLottie");
  fourthLottie.addEventListener('ready', () => {
    let fourthLottieData;
    fourthLottieData = fourthLottie.getLottie();
    LottieInteractivity.create({
      player: fourthLottieData,
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
  })

  let fifthLottie = document.getElementById("fifthLottie");
  fifthLottie.addEventListener('ready', () => {
    let fifthLottieData;
    fifthLottieData = fifthLottie.getLottie();
    LottieInteractivity.create({
      player: fifthLottieData,
      mode: 'scroll',
      actions: [
        {
          visibility: [0, 1.0],
          type: 'loop',
          frames: [70, 500],
        },
      ],
    });
  })

  let seventhLottie = document.getElementById("seventhLottie");
  seventhLottie.addEventListener('ready', () => {
    let seventhLottieData;
    seventhLottieData = seventhLottie.getLottie();

    LottieInteractivity.create({
      player: seventhLottieData,
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
  })

  let eighthLottie = document.getElementById("eighthLottie");
  eighthLottie.addEventListener('ready', () => {
    let eighthLottieData;
    eighthLottieData = eighthLottie.getLottie();
    LottieInteractivity.create({
      player: eighthLottieData,
      mode: 'cursor',
      actions: [
        {
          position: { x: [0, 1], y: [0, 1] },
          type: "seek",
          frames: [0, 280]
        }
      ]
    });
  })

  let ninthLottie = document.getElementById("ninthLottie");
  ninthLottie.addEventListener('ready', () => {
    let ninthLottieData;
    ninthLottieData = ninthLottie.getLottie();

    LottieInteractivity.create({
      player: ninthLottieData,
      mode: 'cursor',
      actions: [
        {
          position: { x: [0, 1], y: [-1, 2] },
          type: 'seek',
          frames: [0, 180],
        },
      ],
    });
  })

  let tenthLottie = document.getElementById("tenthLottie");
  tenthLottie.addEventListener('ready', () => {
    let tenthLottieData;
    tenthLottieData = tenthLottie.getLottie();

    LottieInteractivity.create({
      player: tenthLottieData,
      mode: 'cursor',
      actions: [
        {
          type: 'click',
          forceFlag: false
        },
      ],
    });
  })

  let eleventhLottie = document.getElementById("eleventhLottie");
  eleventhLottie.addEventListener('ready', () => {
    let eleventhLottieData;
    eleventhLottieData = eleventhLottie.getLottie();


    LottieInteractivity.create({
      player: eleventhLottieData,
      mode: 'cursor',
      actions: [
        {
          type: 'hover',
          forceFlag: false
        },
      ],
    });
  })

  let toggleLottie = document.getElementById("toggleLottie");
  toggleLottie.addEventListener('ready', () => {
    let toggleLottieData;
    toggleLottieData = toggleLottie.getLottie();


    LottieInteractivity.create({
      player: toggleLottieData,
      mode: 'cursor',
      actions: [
        {
          type: 'toggle'
        }
      ]
    });
  })




  // LottieInteractivity.create({
  //   player: '#twelfthLottie',
  //   mode: "scroll",
  //   actions: [
  //     {
  //       visibility: [0.50, 1.0],
  //       type: "play"
  //     },
  //   ]
  // });

  // LottieInteractivity.create({
  //   player: '#thirteenthLottie',
  //   mode: 'cursor',
  //   actions: [
  //     {
  //       type: 'hold'
  //     }]
  // });

  // LottieInteractivity.create({
  //   player: '#fourteenthLottie',
  //   mode: 'cursor',
  //   actions: [
  //     {
  //       type: 'pauseHold'
  //     }]
  // });

  let birdExplodingLottie = document.getElementById("birdExploding");
  birdExplodingLottie.addEventListener('ready', () => {
    let birdExplodingLottieData;
    birdExplodingLottieData = birdExplodingLottie.getLottie();


    LottieInteractivity.create({
      player: birdExplodingLottieData,
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
