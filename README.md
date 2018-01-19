# bth-scribe

About
-----
Tool for converting midi files to the bth music notation format.

TODO
----
- command line args. i.e. Rules for output format
- Event grouping options.
- Detect trills
- Strip out notes that are too fast.
- Create layout system/page elements.
- Dynamically determine clefs for tracks.
- Create webpage for testing and documentation.
- Break and tie notes over bars.
- Notate leading tones with correct accidentals.

- When quantizing, long notes may need to be broken into tied notes. e.x.
```javascript
QUANTIZATION = 480 / 32; // Quantizing to 128th notes.
const track = [{
    deltaTime: 0,
    channel: 0,
    type: 'noteOn',
    noteNumber: 72,
    velocity: 80
}, {
    deltaTime: 1823,
    running: true,
    channel: 0,
    type: 'noteOff',
    noteNumber: 72,
    velocity: 0
}]
// noteOff quantizes to 1830. This breaks ticksToDuration(480, 1830). Note needs.
// to be broken to a tie.
```
