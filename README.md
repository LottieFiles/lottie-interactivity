# Lottie Interactivity

![npm (scoped)](https://img.shields.io/npm/v/@lottiefiles/lottie-interactivity?style=flat-square)
![NPM](https://img.shields.io/npm/l/@lottiefiles/lottie-interactivity?style=flat-square)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@lottiefiles/lottie-interactivity?style=flat-square)

This is a small library to add scrolling and cursor interactivity to your Lottie Animations. This can be used with the
[Lottie Web-Player Component](https://www.lottiefiles.com/web-player) or the
[Lottie Player](https://github.com/airbnb/lottie-web).

## Documentation

For full documentation, visit [docs.lottiefiles.com/lottie-interactivity](https://docs.lottiefiles.com/lottie-interactivity/)


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

#### To see examples of all these features, please visit the [LottieFiles interactivity page.](https://lottiefiles.com/interactivity#LI-chaining)

---

## Getting started

#### 1. Import lottie player script to DOM

```javascript
<script src="https://unpkg.com/@lottiefiles/lottie-player@1/dist/lottie-player.js"></script> // place this in your body element
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

Configuration modes include "scroll" where the animation will be synced to the scrolling of the window, "cursor"
where the scrolling of the animation will be synced to the cursor position within the container. And "chain" allowing you to interact with multiple Lottie animations one after the other.

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

Lottie-Interactivity has a wide variety of interactions and modes possible, allowing you to easily add interactions to your Lottie animations. For the full documentation on what's possible and how to use this library [click here](https://docs.lottiefiles.com/lottie-interactivity/).



##### To see examples of all these features, please visit the [LottieFiles interactivity page.](https://lottiefiles.com/interactivity#LI-chaining)

---

## Our other Lottie related libraries

<table style="table-layout:fixed; white-space: nowrap;">
  <tr>
    <th>Project</th>
    <th>Description</th>
  </tr>
  <!-- TEMPLATE FOR NEW ROW -->
  <!-- START ROW
  <tr>
    <td>lang</td>
    <td><a href="" target="_blank" rel="noopener noreferrer">supabase-lang</a></td>
  </tr>
  END ROW -->
  <tr>
    <td><a href="https://github.com/LottieFiles/lottie-player" target="_blank" rel="noopener noreferrer">lottie-player</a></td>
    <td>
      A Web Component for easily embedding and playing Lottie animations and the Lottie-based Telegram Sticker (tgs) animations in websites.
    </td>
  </tr>  
  <tr>
    <td><a href="https://github.com/LottieFiles/lottie-react" target="_blank" rel="noopener noreferrer">lottie-react</a></td>
    <td>
    A React component for the Lottie Web player.
    </td>
  </tr>
  <tr>
    <td><a href="https://github.com/LottieFiles/lottie-vue" target="_blank" rel="noopener noreferrer">lottie-vue</a></td>
    <td>
    A Vue component for the Lottie player.
    </td>
  </tr>
  <tr>
    <td><a href="https://github.com/LottieFiles/svelte-lottie-player" target="_blank" rel="noopener noreferrer">svelte-lottie-player</a></td>
    <td>
    Lottie player component for use with Svelte.
    </td>
  </tr>
  <tr>
    <td><a href="https://github.com/LottieFiles/jlottie" target="_blank" rel="noopener noreferrer">jLottie</a></td>
    <td>
    jLottie is suitable as a general purpose lottie player, though implements a subset of the features in the core player - this approach leads to a tiny footprint and great performance.
    </td>
  </tr>
  <tr>
    <td><a href="https://github.com/orgs/dotlottie/repositories" target="_blank" rel="noopener noreferrer">dotLottie</a></td>
    <td>
    dotLottie is an open-source file format that aggregates one or more Lottie files and their associated resources into a single file. They are ZIP archives compressed with the Deflate compression method and carry the file extension of ".lottie".
    </td>
  </tr>
  <tr>
    <td><a href="https://github.com/LottieFiles/lottie-js" target="_blank" rel="noopener noreferrer">lottie-js</a></td>
    <td>
    The library consists of methods to map the Lottie JSON to the object model and interact with properties as well as manipulate them.
    </td>
  </tr>
  <tr>
    <td><a href="https://github.com/LottieFiles/lottie-theming" target="_blank" rel="noopener noreferrer">lottie-theming</a></td>
    <td>
    A library to extract themable properties and apply different themes to a given Lottie
    </td>
  </tr>


</table>

## Community & Support

- [Github issues.](https://github.com/LottieFiles/lottie-interactivity/issues) For bugs and errors you encounter using this player.
- [Discord.](https://lottiefiles.com/discord) For hanging out with the community and sharing your awesome Lottie animations!

## Contributing

We use changesets to maintain a changelog for this repository. When making any change to the codebase that impacts functionality or performance we require a changeset to be present.

To add a changeset run:

```
yarn run changeset
```

And select the type of version bump you'd like (major, minor, patch).

You can document the change in detail and format it properly using Markdown by opening the ".md" file that the "yarn changeset" command created in the ".changeset" folder. Open the file, it should look something like this:

```
---
"@lottiefiles/pkg1": minor
"@lottiefiles/pkg2": major
---
This is where you document your **changes** using Markdown.
- You can write
- However you'd like
- In as much detail as you'd like
Aim to provide enough details so that team mates and future you can understand the changes and the context of the change.
```

You can commit your changes and the changeset to your branch and then create a pull request on the develop branch.

## License

MIT License © LottieFiles.com
