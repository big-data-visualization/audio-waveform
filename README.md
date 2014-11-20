# audio-waveform

Simple audio waveform visualization, depends on d3.

![screenshot](https://raw.githubusercontent.com/big-data-visualization/audio-waveform/assets/screenshot.png)
============

## Demo

http://big-data-visualization.github.io/audio-waveform/

## Compatibility

- Browser(require: `getUserMedia/Stream API`, ref: http://caniuse.com/#search=getUserMedia%2FStream%20API)

    + Firefox 31+
    + Chrome 31+
    + Opera 25+
    + Android Browser 37+
    + Chrome for Android 38+

- Module specs
    + Native browser environment
    + AMD
    + CMD
    + [FIS](http://fis.baidu.com/)
    + and else

## USAGE

- Install with [Bower](http://bower.io/)

```bash
$ bower install audio-waveform
```

- Basic template, from: `demo/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Audio waveform</title>
<style>
*,
*:before,
*:after {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
}
html {
    box-sizing: border-box;
    background: #000;
}

.audio-waveform{
    width: 100%;
    height: 200px;
}
</style>
</head>
<body>
<div id="audioWaveform" class="audio-waveform"></div>
</body>
<script src="js/d3.min.js"></script>
<script src="js/audio_waveform.min.js"></script>
<script>
;(new audioWave).init({
    selector: "#audioWaveform"
})
</script>
</html>
```

## Options

Use these options like:

```js
;(new audioWave).init(options)
```

| Option        | Type | Default        | Describe |
| ------------- |:-----|:--------:| -----:|
| selector     | `String` | NaN | The `selector` of element is necessary. |
| fps     | `Number` | 60 | fps |
| onError     | `Function` | empty function | On error handle, maybe not supports `getUserMedia/Stream API` |
| onMouseover     | `Function` | empty function | On mouseover handle. |
| onMouseout     | `NumFunctionber` | empty function | On mouseout handle. |
| buflen     | `Number` | 1024 | The audio stream buffer length. |

## Development

- Install requires

```bash
$ npm i gulp -g
$ npm i
```

- See demo

```
$ gulp demo
```

Then head to `http://localhost:3000` in your browser.

- Build

```bash
$ gulp
```
