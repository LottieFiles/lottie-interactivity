# Lottie Interactivity

# Requirements

This is a small library to add scrolling interactivity to your Lottie Animations.
The library uses the [Lottie Web-Player](https://www.lottiefiles.com/web-player).

# Installation

## via npm

```javascript
npm install --save @lottiefiles/lottie-player && npm install (package here)
```

## via cdn

```javascript
<script src="https://unpkg.com/@lottiefiles/lottie-player@0.2.0/dist/lottie-player.js"></script>
```

```javascript
(interactivity library)
```

## via source

`download and include interactivity.min.js or interactivity.js in to your html page`

# Getting started

Add a Lottie to html dom with an ID set to the div

```javascript
<lottie-player
  id="firstLottie"
  src="https://assets2.lottiefiles.com/packages/lf20_i9mxcD.json"
  style="width:400px; height: 400px;"
>
  {" "}
</lottie-player>
```

Initialize interactivity library

```javascript
const Ilottie = new LottieInteractivity();
```

Setup configuration
The name of the object ie: <span style="color: red;">'firstLottie'</span> in this example is the ID set to the lottie web component on the html page.This object takes an object named actions which consists of an array of objects. Multiple objects can be added into this array and therefore multiple actions such as <span style="color: #d73a49;">"seek"</span>, <span style="color: #d73a49">"stop"</span> and <span style="color: #d73a49">"play"</span>, can be set. Each object has a start and end which is essentially a percentage for the height of the lottie container.

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
