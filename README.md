# Lottie Interactivity

# Requirements

This is a small library to add scrolling interactivity to your Lottie Animations. This can be used with the
[Lottie Web-Player Component](https://www.lottiefiles.com/web-player) or the
[Lottie Player](https://github.com/airbnb/lottie-web).

# Installation

## via yarn

```
yarn add @lottiefiles/lottie-interactivity
```

## via npm

```
npm install --save @lottiefiles/lottie-interactivity
```

## via cdn

```html
<script src="https://unpkg.com/@lottiefiles/lottie-interactivity@0.1.0/dist/lottie-interactivity.min.js"></script>
```

# Demo

Demos are showcased at https://lottiefiles.com/interactivity

The javascript code for the demo is available at codesandbox
https://codesandbox.io/s/lottie-interactivity-fyffj?file=/src/index.js

# Getting started

#### 1. Add a Lottie to html dom with an ID set to the div

```html
<lottie-player
  id="firstLottie"
  src="https://assets2.lottiefiles.com/packages/lf20_i9mxcD.json"
  style="width:400px; height: 400px;"
>
  {" "}
</lottie-player>
```

#### 2. Setup configuration

The name of the object ie: 'firstLottie' in this example is the ID set to the lottie web component on the html page.
This object takes an object named actions which consists of an array of objects. Multiple objects can be added into this
array and therefore multiple actions such as "seek", "stop" and "loop", can be set. Each object has a start and end
which is essentially a percentage for the height of the lottie container and is a value between 0 and 1.

```javascript
const animActions = {
  mode: 'scroll',
  firstLottie: {
    actions: [
      {
        visibility[0,1],
        type: 'seek',
        frames: [0, 300],
      },
    ],
  },
};
```

#### 3. Call the LottieInteractivity.create method to instantiate the library and pass the configuration object as a parameter

```javascript
LottieInteractivity.create(animActions);
```

# Scroll effect relative to container

There may be situations where you would like to wrap the lottie player inside a container or just in general sync the
lottie scroll with a div on your page. In which case you may pass a container variable with the container id into the
action object as shown below.

```javascript
const animActions = {
  mode: 'scroll',
  firstLottie: {
    container: 'myContainerId',
    actions: [
      {
        visibility: [0, 1],
        type: 'seek',
        frames: [0, 300],
      },
    ],
  },
};
LottieInteractivity.create(animActions);
```

# Scroll effect with offset

If you would like to add an offset to the top of the container or player you may add an extra action object to the
array. As per the example config below, from 0 to 30% of the container, the lottie will be stopped and from 30% to 100%
of the container the lottie will be synced with the scroll.

```javascript
const animActions = {
  mode: 'scroll',
  firstLottie: {
    actions: [
      {
        visibility: [0, 0.3],
        type: 'stop',
        frames: [0],
      },
      {
        visibility: [0.3, 1],
        type: 'seek',
        frames: [0, 300],
      },
    ],
  },
};
LottieInteractivity.create(animActions);
```

# Scroll effect with offset and segment looping

In cases where you would like the animation to loop from a specific frame to a specific frame, you can add an additional
object to actions in which you can specifify the frames. In the example below, the lottie loops frame 150 to 300 once
45% of the container is reached.

```javascript
const animActions = {
  mode: 'scroll',
  firstLottie: {
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
  },
};
LottieInteractivity.create(animActions);
```

# Play segments

If you would like to play the animation and loop it only from a certain frame to a certain frame, then you can utilize
the loop action and frames variable. The config below shows this example.

```javascript
const animActions = {
  mode: 'scroll',
  firstLottie: {
    actions: [
      {
        visibility: [0.45, 1],
        type: 'loop',
        frames: [17, 63],
      },
    ],
  },
};
LottieInteractivity.create(animActions);
```

# Play on hover

The play on hover feature is part of the [Lottie Web-Player](https://www.lottiefiles.com/web-player) library. Simply add
the hover prop to the player component as shown below. Using hover via the component prop however does not allow you to
play segments of the animation, this means the animation will always play from frame 0 to the last frame available.

```html
<lottie-player
  id="firstLottie"
  hover
  src="https://assets6.lottiefiles.com/packages/lf20_NQAN9S.json"
  style="width: 400px; height: 400px;"
></lottie-player>
```

# Play segments on hover

To play the animation on hover you can pair the cursor mode with the play action. You may even utilize this to stop the
animation on hover via the "stop" type action instead of "play".

```javascript
const animActions = {
  mode: 'cursor',
  firstLottie: {
    actions: [
      {
        position: { x: [0, 1], y: [0, 1] },
        type: 'play',
        frames: [50, 139],
      },
    ],
  },
};
LottieInteractivity.create(animActions);
```

# Sync cursor movement with animation

To sync the position of the cursor with the frames of the animation , you will need to add a position object to the
action. This tells the liberary which position in the container that the animation should end at.

```javascript
const animActions = {
  mode: 'cursor',
  firstLottie: {
    actions: [
      {
        position: { x: [0, 1], y: [0, 1] },
        type: 'seek',
        frames: [0, 139],
      },
    ],
  },
};
LottieInteractivity.create(animActions);
```
