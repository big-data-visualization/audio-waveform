/**
 * Audio waveforms render, depends on d3.
 * @author leecade@163.com
 */

var WIN = window

    /**
     * Empty function.
     * @return {Undefined}
     */
    , noop = function() {}

    /**
     * RequestAnimationFrame shim.
     * @type {Function}
     */
    , rAF = WIN.requestAnimationFrame
        || WIN.webkitRequestAnimationFrame
        || WIN.mozRequestAnimationFrame
        || function(cb){
            WIN.setTimeout(cb, 1000 / 60)
        }

    /**
     * Constructor.
     * @type {Function}
     */
    , audioWave = noop

    /**
     * Ref to prototype
     * @type {Function}
     */
    , fn = audioWave.prototype

/**
 * Init
 * @param  {Object} opts options
 * @return {this}
 */
fn.init = function(opts) {
    var that = this
        , supportAudio
    opts = opts || {}

    // The `selector` of element is necessary.
    if(!opts.selector) return that

    that.opts = opts
    that.selector = opts.selector
    that.fps = opts.fps || 60
    that.onError = opts.onError || noop
    that.onMouseover = opts.onMouseover || noop
    that.onMouseout = opts.onMouseout || noop
    that.onUpdate = opts.onUpdate || noop
    that.buflen = opts.buflen || 1024
    that.buf = new Uint8Array(that.buflen)

    supportAudio = that.initRender()
        .setupStream()
    supportAudio && supportAudio.loop()

    return that
}

/**
 * A method of render loop, control by fps.
 * @return {[type]} [description]
 */
fn.loop = function() {
    var that = this
        , interval = 1e3 / that.fps
        , then = +new Date

    return function loop() {
        rAF(loop)
        var now = +new Date
            , delta = now - then
        if(delta > interval) {
            then = now - (delta % interval)
            that.updateRender()
        }
    }()
}

/**
 * Init scene render.
 * @return {this}
 */
fn.initRender = function() {
    var that = this

    that.wrap = d3.select(that.selector)
    that.width = parseFloat(that.opts.width || that.wrap.style("width"))
    that.height = parseFloat(that.opts.height || that.wrap.style("height"))

    that.xScale = d3.scale.linear()
        .domain([0, that.buflen])
        .rangeRound([0, that.width])
    that.yScale = d3.scale.linear()
        .domain([0, 255])
        .rangeRound([that.height, 0])

    that.waveforms = that.wrap.append("svg")
        .attr({
            "width": that.width
            , "height": that.height
        })
        .on({
            mouseover: function(e) {
                that.onMouseover.call(that, e)
            }
            , mouseout: function(e) {
                that.onMouseout.call(that, e)
            }
        })
        .append("g")
        .style("stroke", "#fff")
        .style("stroke-width", 1)
        .selectAll("line")
        .data(that.buf)
        .enter()
        .append("line")
    return that
}

/**
 * The steup of get audio stream
 * @return {this}
 */
fn.setupStream = function() {
    var that = this
        , nav = navigator
        , audio = WIN.AudioContext
            || WIN.webkitAudioContext
        , userMedia = nav.getUserMedia
            || nav.webkitGetUserMedia
            || nav.mozGetUserMedia

    // First detect `audio` / `getUserMedia` support.
    if(!audio || !userMedia) return that.onError()

    // Create audio analyser.
    audio = new audio()
    that.analyser = audio.createAnalyser()
    that.analyser.fftSize = that.buflen

    try{
        userMedia.call(nav, {
            audio: true
        }, function(stream) {
            audio.createMediaStreamSource(stream).connect(that.analyser)
        }, noop)
    }
    catch(e) {
        return that.onError()
    }
    return that
}

/**
 * Update waveforms render.
 * @return {this}
 */
fn.updateRender = function() {
    var that = this
    if(!that.analyser) return
    that.analyser.getByteTimeDomainData(that.buf)
    that.waveforms && that.waveforms.data(that.buf)
        .attr({
            "x1": function(d, i) {
                return that.xScale(i > 0 ? i - 1 : 0)
            }
            , "y1": function(d, i) {
                return that.yScale(i > 0 ? that.buf[i-1] : that.buf[i])
            }
            , "x2": function(d, i) {
                return that.xScale(i)
            }
            , "y2": function(d, i) {
                return that.yScale(d)
            }
        })
    that.onUpdate(that, that.buf)
    return that
}

if(typeof module !== "undefined"
   && typeof module.exports !== "undefined") module.exports = audioWave
else return audioWave
