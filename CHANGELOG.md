# Changelog

## 1.6.1

### Patch Changes

- fixed stop error, added playOnce to scroll

## 1.6.0

### Minor Changes

- 7b255ff: added pause and pauseHold state

## 1.5.2

### Patch Changes

- adding changesets and dual deployment to npm and gpr

## 1.5.1

### Patch Changes

- added changesets All notable changes to this project will be documented in this file. The format is based on
  [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to
  [Semantic Versioning](https://semver.org/spec/v2.0.0.html), enforced with
  [semantic-release](https://github.com/semantic-release/semantic-release).

## [1.5.1](https://github.com/LottieFiles/lottie-interactivity/compare/v1.5.0...v1.5.1) (2022-04-26)

### Bug Fixes

- fixed autoplay not being removed after onComplete transition
  ([c2ba40d](https://github.com/LottieFiles/lottie-interactivity/commit/c2ba40d5553133c9dd56c06508338ef6d853ba1a))
- fixed forceflag not working on click
  ([fc4f818](https://github.com/LottieFiles/lottie-interactivity/commit/fc4f8183de8aa40b86aa42fd884eb1ce5148264e))

# [1.5.0](https://github.com/LottieFiles/lottie-interactivity/compare/v1.4.0...v1.5.0) (2022-04-12)

### Features

- added jumptToInteraction method
  ([8def8b5](https://github.com/LottieFiles/lottie-interactivity/commit/8def8b503aad95c8156d729057b896c93dd32d66))

# [1.4.0](https://github.com/LottieFiles/lottie-interactivity/compare/v1.3.8...v1.4.0) (2022-04-12)

### Features

- made nextInteraction method public
  ([642a64d](https://github.com/LottieFiles/lottie-interactivity/commit/642a64dc97c8a1eda969f3d7c3cf2e30bc0b9451))

## [1.3.8](https://github.com/LottieFiles/lottie-interactivity/compare/v1.3.7...v1.3.8) (2022-03-16)

### Bug Fixes

- added fixes to click and hold transitions
  ([43eb8c5](https://github.com/LottieFiles/lottie-interactivity/commit/43eb8c514e29369535b4c2906976717399d86e51))

## [1.3.7](https://github.com/LottieFiles/lottie-interactivity/compare/v1.3.6...v1.3.7) (2022-03-07)

### Bug Fixes

- fixed container null issue on wordpress
  ([fa0e5e7](https://github.com/LottieFiles/lottie-interactivity/commit/fa0e5e7b2128cf1c59cd7aa3385d43d535f72a8b))

## [1.3.6](https://github.com/LottieFiles/lottie-interactivity/compare/v1.3.5...v1.3.6) (2022-02-21)

### Bug Fixes

- fixed error when player is destroyed and redefineOptions is called
  ([7d2c4e3](https://github.com/LottieFiles/lottie-interactivity/commit/7d2c4e31db3bca7fde206c9c77debaaeebcd6b3c))

## [1.3.5](https://github.com/LottieFiles/lottie-interactivity/compare/v1.3.4...v1.3.5) (2022-02-17)

### Bug Fixes

- added usecapture to scroll listener
  ([763cc37](https://github.com/LottieFiles/lottie-interactivity/commit/763cc37d471c13792a86a57aedd271f137f9d836))
- changed way window is used
  ([9a6e7b9](https://github.com/LottieFiles/lottie-interactivity/commit/9a6e7b9a5efcb0dd3cb7fe23b89d2cfbe110e5ac))

## [1.3.4](https://github.com/LottieFiles/lottie-interactivity/compare/v1.3.3...v1.3.4) (2022-02-01)

### Bug Fixes

- **scrolling:** fixed segments not playing on scroll with 'play' action type
  ([9d360c7](https://github.com/LottieFiles/lottie-interactivity/commit/9d360c790dcd912b770412bf473f3e6d4aec1269))

## [1.3.3](https://github.com/LottieFiles/lottie-interactivity/compare/v1.3.2...v1.3.3) (2022-01-25)

### Bug Fixes

- added init methods when domloaded event has already fires
  ([a6f4c89](https://github.com/LottieFiles/lottie-interactivity/commit/a6f4c892557a50d70ecd27d99fa37b86c8a2bce8))

## [1.3.2](https://github.com/LottieFiles/lottie-interactivity/compare/v1.3.1...v1.3.2) (2022-01-10)

### Bug Fixes

- **interactions:** added additional comments
  ([5a77a9c](https://github.com/LottieFiles/lottie-interactivity/commit/5a77a9c9169886846acc62ffebde48e0c3ace064))
- **interactions:** added mobile support for interactions
  ([b8e3a9e](https://github.com/LottieFiles/lottie-interactivity/commit/b8e3a9e1c87683559b301dd3d364fb49154c4092))

## [1.3.1](https://github.com/LottieFiles/lottie-interactivity/compare/v1.3.0...v1.3.1) (2022-01-05)

### Bug Fixes

- **stop method:** corrected remove event listener
  ([7c148ad](https://github.com/LottieFiles/lottie-interactivity/commit/7c148ad117a0400087c6edf37c346a37ac59eaf0))
- **sync to cursor:** added touchmove listener to sync animation for touch screens
  ([88cf1b3](https://github.com/LottieFiles/lottie-interactivity/commit/88cf1b3e4973d19e169b708eebde473389864dad))

# [1.3.0](https://github.com/LottieFiles/lottie-interactivity/compare/v1.2.0...v1.3.0) (2021-12-08)

### Features

- **cursor mode:** added toggle interaction
  ([e66b74c](https://github.com/LottieFiles/lottie-interactivity/commit/e66b74cd242b21e85212815d24f0cb193d63c4c5))

# [1.2.0](https://github.com/LottieFiles/lottie-interactivity/compare/v1.1.0...v1.2.0) (2021-11-10)

### Bug Fixes

- **click handler:** fixed faulty call to click handler
  ([69d5b67](https://github.com/LottieFiles/lottie-interactivity/commit/69d5b67c2e3c62f8921667007cf22b4da9875fc8))

### Features

- **additional chain properties:** added speed and delay
  ([b1f5db3](https://github.com/LottieFiles/lottie-interactivity/commit/b1f5db321afb22c82d7bd46ed0171966c0dadd6c))
- **animation loading:** added animation loading for when the library is passed an animation object
  ([e04600d](https://github.com/LottieFiles/lottie-interactivity/commit/e04600d21c753130938587f8ec0b1976b9b4eecb))
- **global:** first draft of interaction chaining
  ([672b0e8](https://github.com/LottieFiles/lottie-interactivity/commit/672b0e8a91f1d48584a3bbee7c045604e27cf06b))
- **interactions:** added ability to load lotties in interaction chaining from 'path' attribute
  ([db3af11](https://github.com/LottieFiles/lottie-interactivity/commit/db3af11c2cf87dc5374b3fbe5f88599106e82bf9))
- **interactions:** added click and hover states, updated example page
  ([853eff2](https://github.com/LottieFiles/lottie-interactivity/commit/853eff283248949be48bf81a5618eba08dcb1806))
- **interactions:** Added click, hover and visible interactions
  ([d97fbad](https://github.com/LottieFiles/lottie-interactivity/commit/d97fbad110a7e50ed829c7e3fafe92edbacff648))
- **interactions:** added jumpTo property to get to a specific interaction index after transition
  ([b3a82f4](https://github.com/LottieFiles/lottie-interactivity/commit/b3a82f45f80f7cd7a1a87bb5658b28f24a05c1ca))
- **interactions:** added sync to cursor to interaction chaining
  ([67331c3](https://github.com/LottieFiles/lottie-interactivity/commit/67331c3ee1f03bb3527d3552aebcc4558ba984e4))
- **interactions chaining:** added dynamic loading of animations, finished examples page
  ([60003f4](https://github.com/LottieFiles/lottie-interactivity/commit/60003f4d3951d8e287bcadbe237f39e9e4f183f2))

# [1.1.0](https://github.com/LottieFiles/lottie-interactivity/compare/v1.0.0...v1.1.0) (2021-09-28)

### Bug Fixes

- **scroll:** use start/end frames in seeking
  ([71f2197](https://github.com/LottieFiles/lottie-interactivity/commit/71f21973334f92e71323a1aa837902ce5b7d406a))

### Features

- **scroll:** reset frame count from loop to seek
  ([270b621](https://github.com/LottieFiles/lottie-interactivity/commit/270b6216ffd76ec4bfa2d59457c83748bae8e3d7))

# 1.0.0 (2021-08-10)

### Bug Fixes

- **examples:** fix a missing and misplaced comma in examples
  ([a922b79](https://github.com/LottieFiles/lottie-interactivity/commit/a922b7906383c43ea76f365d52c99a71b8e8989f))
- **scroll:** with 'scroll' mode and type as 'play' plays animation once and pauses at end
  ([e9ff742](https://github.com/LottieFiles/lottie-interactivity/commit/e9ff74240d1faf6b4385d3f70fd1fa4a8cc81b8d))

# 1.0.0 (2021-06-29)

### Bug Fixes

- **scroll:** with 'scroll' mode and type as 'play' plays animation once and pauses at end
  ([e9ff742](https://github.com/LottieFiles/lottie-interactivity/commit/e9ff74240d1faf6b4385d3f70fd1fa4a8cc81b8d))
