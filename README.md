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

Demos are showcased at https://lottiefiles.com/interactivity

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

### Sync animation with cursor horizontal movement.

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
