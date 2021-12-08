# Lottie Interactivity

![npm (scoped)](https://img.shields.io/npm/v/@lottiefiles/lottie-interactivity?style=flat-square)
![NPM](https://img.shields.io/npm/l/@lottiefiles/lottie-interactivity?style=flat-square)
![David](https://img.shields.io/david/LottieFiles/lottie-interactivity?style=flat-square)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@lottiefiles/lottie-interactivity?style=flat-square)

This is a small library to add scrolling and cursor interactivity to your Lottie Animations. This can be used with the
[Lottie Web-Player Component](https://www.lottiefiles.com/web-player) or the
[Lottie Player](https://github.com/airbnb/lottie-web).

## Installation

#### via yarn

```
yarn add @lottiefiles/lottie-interactivity
```

#### via npm

```
npm install --save @lottiefiles/lottie-interactivity
```

#### via cdn

```html
<script src="https://unpkg.com/@lottiefiles/lottie-interactivity@latest/dist/lottie-interactivity.min.js"></script>
```

## Demo

### To see examples of all these features, please visit the [LottieFiles interactivity page.](https://lottiefiles.com/interactivity#LI-chaining)


If you would like to take a look at some examples, feel free to have a look in the examples folder to see how each of
the Lotties have been implemented.

## Getting started

#### 1. Import lottie player script to DOM

```javascript
<script src="https://unpkg.com/@lottiefiles/lottie-player@0.4.0/dist/lottie-player.js"></script> // place this in your body element
```

#### 2. Add a Lottie to html dom with an ID set to the div

```html
<lottie-player
  id="firstLottie"
  src="https://assets2.lottiefiles.com/packages/lf20_i9mxcD.json"
  style="width:400px; height: 400px;"
>
</lottie-player>
```

#### 3. Setup configuration

The name of the player ie: 'firstLottie' in this example is the ID set to the lottie web component on the html page.
Configration will contain an actions object. This object takes an array named actions which consists of an array of
objects. Multiple objects can be added into this array and therefore multiple actions such as "seek","play", "stop" and
"loop", can be set.

Each object has a start and end which is essentially a percentage for the height of the lottie container and is a value
between 0 and 1. The visibility arrays first value is the start and the second value is the end. This refers to the
percentage of the viewport.

Ensure that the ending frame is the frame you want the interactivity to end at. This could be the last frame or a frame
of your choosing. In this case it is set to 100.

Configuration modes include "scroll" where the animation will be synced to the scrolling of the window and "cursor"
where the scrolling of the animation will be synced to the cursor position within the container.

The configuration can include a container field as shown in the next example. If a container is not provided the parent
div will be taken as a container.

ensure that the interactivity library is imported to the body of your html DOM

```javascript
LottieInteractivity.create({
  mode: 'scroll',
  player: '#firstLottie',
  actions: [
    {
      visibility: [0, 1],
      type: 'seek',
      frames: [0, 100],
    },
  ],
});
```

##### 3.1 React config

The configuration for the library remains the same for react apps. However usage and initialization is as follows.
Import the create function from the lottie interactivity library and call the create function. With frameworks like
react it is ideal to add an event listener that waits for the lottie player to load before calling the interactivity
library. An example is as follows for a very basic react class component.

```javascript
import React from 'react';
import '@lottiefiles/lottie-player';
import { create } from '@lottiefiles/lottie-interactivity';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef(); // 1. create a reference for the lottie player
  }
  componentDidMount() {
    // 3. listen for player load. see lottie player repo for other events
    this.myRef.current.addEventListener('load', function (e) {
      // 4. configure the interactivity library
      create({
        mode: 'scroll',
        player: '#firstLottie',
        actions: [
          {
            visibility: [0, 1],
            type: 'seek',
            frames: [0, 100],
          },
        ],
      });
    });
  }
  render() {
    return (
      <div className="App">
        <div style={{ height: '400px' }}></div>
        <lottie-player
          ref={this.myRef} // 2. set the reference for the player
          id="firstLottie"
          controls
          mode="normal"
          src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
          style={{ width: '320px' }}
        ></lottie-player>
      </div>
    );
  }
}

export default App;
```

##### 3.2 Vue config

The configuration for the library remains the same for vue apps. However usage and initialization is as follows.
Import the create function from the lottie interactivity library and call the create function. With frameworks like
vue it is ideal to add an event listener that waits for the lottie player to load before calling the interactivity
library. An example is as follows for a very basic vue class component.

```javascript
<template>
  <!--  1. Create a lottie player with a reference -->
  <lottie-player id="firstLottie"
                 ref="lottie"
                 controls
                 mode="normal"
                 src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
                 style="width: 320px;">
  </lottie-player>
</template>

<script>
  import '@lottiefiles/lottie-player';
  import { create } from '@lottiefiles/lottie-interactivity';

  export default {
  name: 'App',

  mounted() {
    // 2. listen for player load. See lottie player repo for other events
    this.$refs.lottie.addEventListener('load', function() {
      // 3. configure the interactivity library
      create({
        mode: 'scroll',
        player: '#firstLottie',
        actions: [
          {
            visibility: [0, 1],
            type: 'seek',
            frames: [0, 100],
          },
        ],
      });
    })
  }
}
</script>
```

## Examples

### Scroll effect relative to container

There may be situations where you would like to wrap the lottie player inside a container or just in general sync the
lottie scroll with a div on your page. In which case you may pass a container variable with the container id into the
action object as shown below. The scroll effect in this case will be activate once the "MyContainerId" is in viewport.

```javascript
LottieInteractivity.create({
  player: '#secondLottie',
  container: '#MyContainerId',
  mode: 'scroll',
  actions: [
    {
      visibility: [0, 1.0],
      type: 'seek',
      frames: [0, 100],
    },
  ],
});
```

### Scroll effect with offset

If you would like to add an offset to the top of the container or player you may add an extra action object to the
array. As per the example config below, from 0 to 30% visibility of the container, the lottie will be stopped and from
30% to 100% visibility of the container the lottie will be synced with the scroll.

```javascript
LottieInteractivity.create({
  player: '#firstLottie',
  mode: 'scroll',
  actions: [
    {
      visibility: [0, 0.3],
      type: 'stop',
      frames: [0],
    },
    {
      visibility: [0.3, 1],
      type: 'seek',
      frames: [0, 100],
    },
  ],
});
```

### Scroll effect with offset and segment looping

In cases where you would like the animation to loop from a specific frame to a specific frame, you can add an additional
object to actions in which you can specify the frames. In the example below, the lottie loops frame 150 to 300 once 45%
of the container is reached.

```javascript
LottieInteractivity.create({
  player: '#firstLottie',
  mode: 'scroll',
  actions: [
    {
      visibility: [0, 0.3],
      type: 'stop',
      frames: [0],
    },
    {
      visibility: [0.3, 0.45],
      type: 'seek',
      frames: [0, 150],
    },
    {
      visibility: [0.45, 1],
      type: 'loop',
      frames: [150, 300],
    },
  ],
});
```

### Play segments

If you would like to play the animation and loop it only from a certain frame to a certain frame of your choosing, then
you can utilize the loop action and frames variable. The config below shows this example.

```javascript
LottieInteractivity.create({
  player: '#firstLottie',
  mode: 'scroll',
  actions: [
    {
      visibility: [0.45, 1],
      type: 'loop',
      frames: [17, 63],
    },
  ],
});
```

### Play segments on hover

To play the animation on hover you can pair the cursor mode with the play action. You may even utilize this to stop the
animation on hover via the "stop" type action instead of "play". Available cursor actions are "loop","seek","play" and
"stop".

```javascript
LottieInteractivity.create({
  player: '#firstLottie',
  mode: 'cursor',
  actions: [
    {
      position: { x: [0, 1], y: [0, 1] },
      type: 'loop',
      frames: [50, 139],
    },
  ],
});
```

### Sync animation with cursor movement

To sync the position of the cursor with the frames of the animation , you will need to add a position object to the
action. This tells the library which position in the container that the animation should end at. As you move the cursor
along the given container (No container provided in this example and the library takes the wrapper div for the Lottie as
the container) the frames will move according to the cursors position.

```javascript
LottieInteractivity.create({
  player: '#firstLottie',
  mode: 'cursor',
  actions: [
    {
      position: { x: [0, 1], y: [0, 1] },
      type: 'seek',
      frames: [0, 100],
    },
  ],
});
```

### Sync animation with cursor horizontal movement

The cursor sync function can be used to either sync with the horizontal movement of the cursor or the vertical movement
of the cursor. This example shows the horizontal sync.

```javascript
LottieInteractivity.create({
  player: '#firstLottie',
  mode: 'cursor',
  actions: [
    {
      position: { x: [0, 1], y: [-1, 2] },
      type: 'seek',
      frames: [0, 179],
    },
    {
      position: { x: -1, y: -1 },
      type: 'stop',
      frames: [0],
    },
  ],
});
```

### Play animation on click

Play a Lottie when clicked on. Clicking multiple times won't restart
the animation if its already playing. However if you want the animation to restart as soon as it's clicked on
set the 'forceFlag' property to true.

```javascript
LottieInteractivity.create({
  player:'#firstLottie',
  mode:"cursor",
    actions: [{
        type: "click",
        forceFlag: false
      }]
});
```

### Play animation on hover

Play a Lottie when hovered. Hovering multiple times won't restart
the animation if its already playing. However if you want the animation to restart as soon as it's hovered on
set the 'forceFlag' property to true.

```javascript
LottieInteractivity.create({
  player:'#firstLottie',
  mode:"cursor",
  actions: [{
    type: "hover",
    forceFlag: false
  }]
});
```

### Toggle animations

Toggle a Lottie when clicked on.

```javascript
LottieInteractivity.create({
  player:'#toggleLottie',
  mode: "cursor",
  actions: [{
      type: "toggle",
    }]
});
```

### Play animation when visible

Play a Lottie when it is visible. Visibility can be customised to play the
animation when a percentage of the container is reached. Here [0.50, 1.0] means the animation will play when 50% of the container is
reached, [0, 1.0] will play as soon as the container is visible.

```javascript
LottieInteractivity.create({
  mode:"cursor",
  player:'#firstLottie',
  actions: [{
    visibility: [0.50, 1.0],
    type: "play"
  }]
});
```

### Play animation on hold

The animation will play when the cursor is placed over the animation,
and in reverse if the cursor leaves the animation.

```javascript
LottieInteractivity.create({
  mode:"cursor",
  player:'#firstLottie',
  actions: [{
    type: "hold"
  }]
});
```

### Play animation on hold and pause when released

The animation will play when the cursor is placed over the animation,
and pause if the cursor leaves the animation.

```javascript
LottieInteractivity.create({
  mode:"cursor",
  player:'#fourteenthLottie',
  actions: [{
    type: "pauseHold"
  }]
});
```

## Chaining mode

When using this mode you now have the power to chain different segments of animations depending on how
the user interacts (click x amount of times, hover..) with the segment but also with Lottie events (onComplete).
By using the 'chain' mode Lottie-interactivity can even load separate animations in succession depending on the interaction.

In this example 3 segments are present. The pigeon running on loop, an explosion when the user clicks and the feathers falling once
the explosion has finished.

```javascript
LottieInteractivity.create({
  mode:"chain",
  player:'#explodingBird',
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
      transition: 'onComplete',
      frames: 'feathers',
      reset: true
    }
  ],
});
```

## Getting started

The name of the player ie: 'explodingBird' in this example is the ID set to the lottie-player component on the
html page. Interaction chaining can be activated by using the 'chain' mode. An 'actions' array serves to
configure each segment and how to interact with it.
Multiple objects can be added into this array and therefore multiple different ways to interact and transit
through different segments of an animation.

Each object in the actions array should have a 'state' and 'transition' property.

### State

State defines how the segment of the animation will be playing when loaded and waiting for an interaction.

State can have the following values:

#### autoplay
Plays the animation once on load.

#### loop
Loops the animation.

Optionally a 'loop' property can be defined to loop x amount of times

#### click
Plays the animation on click.

#### hover
Plays the animation on hover.

#### none
Animation won't play


### Transition

Transition defines the interaction that will cause Lottie-Interactivity to go to the next interaction link in the chain.

Transition can have the following values:

#### click
Causes a transition when clicking on the animation is detected.

Optionally a 'count' property can be defined to transit after x amount of clicks

#### hover
Causes a transition when hovering over the animation is detected.

Optionally a 'count' property can be defined to transit after x amount of hovers

#### repeat
Play the animation x amount of times before transiting.

A 'repeat' property containing a number can then be used to define how many times the animation will repeat before transiting

#### hold
Hover over the animation for the length of the 'frames' property to cause a transition. If the cursor leaves the animation, it plays in reverse.

#### pauseHold
Hover over the animation for the length of the 'frames' property to cause a transition. If the cursor leaves the animation, it pauses.

#### seek
Sync animation with cursor position. A 'position' object will be needed as well as a 'frames' array.

#### onComplete
When the animation has finished playing the defined segment, a transition will occur.

#### none
Animation won't transit.

### Frames

Each link in the interaction chain can have a defined segment of frames to play. The 'frames' array's first value
is the start and the second value is the end. If you don't like defining frame numbers, named markers can also be used.
More information about named markers <a href="https://github.com/airbnb/lottie-web/wiki/Markers" class="lf-link text-grey-dark font-lf-bold" target="_blank"> here. </a>

If no frames are provided the entirety of the animation is played.

### Path

A 'path' property can be used to define where to load the animation from.

### Additional properties

#### jumpTo: [interaction index]
Jumps to the action defined at the submitted index after the necessary interaction is detected.

#### reset: [true/false]
Useful for the last action, if true will go back to the first action.
The 'transition' event is fired from the lottie-player element every time a transition occurs.
The event contains the following details:
oldIndex
newIndex

#### forceFlag: [true/false]
If true, click and hover interactions will play straight away. Otherwise, will ignore if animation is already playing.

#### delay: [time in milliseconds]
Will delay all interactions and playback of the animation until the delay is finished.

#### speed: [integer]
Set the speed of the animation, 1 being the default speed.

### To see examples of all these features, please visit the [LottieFiles interactivity page.](https://lottiefiles.com/interactivity#LI-chaining)
