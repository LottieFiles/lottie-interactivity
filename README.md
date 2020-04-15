# Lottie Interactivity

# Requirements

This is a small library to add scrolling interactivity to your Lottie Animations.
The library uses the [Lottie Web-Player](https://www.lottiefiles.com/web-player).

# Installation

## via npm

`npm install --save @lottiefiles/lottie-player`
`npm install (package here)`

## via cdn

`<script src="https://unpkg.com/@lottiefiles/lottie-player@0.2.0/dist/lottie-player.js"></script>`

`script link from unpckg`

## via source

`download and include interactivity.min.js or interactivity.js in to your html page`

# Getting started

Add a Lottie to html dom with an id set to the div

```
<lottie-player id="firstLottie" src="https://assets2.lottiefiles.com/packages/lf20_i9mxcD.json" style="width:400px; height: 400px;"> </lottie-player>
```

Initialize interactivity library

```javascript
const Ilottie = new LottieInteractivity();
```

Setup configuration

```javascript
const animActions = {
  firstLottie: {
    actions: [
      {
        start: 0,
        end: 1,
        type: "seek",
        frames: [0, 150],
      },
    ],
  },
};
```

```javascript
Ilottie.lottieScroll(animActions);
```

# Scroll effect

# Scroll effect with offset

# Scroll effect with offset and segment looping

# Play on entering viewport

# Play segments

# Play on hover

# Play segments on hover
