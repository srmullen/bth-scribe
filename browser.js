window.teoria = require('teoria');
window.scribe = require('./src/scribe');
window.time = require('./src/time');
window.stringify = require('./src/stringify');
window.utils = require('./src/utils');
window.invent1 = require('./parsedMidi/invent1.json');
window.invent2 = require('./parsedMidi/invent2.json');

setTicks(invent1);
setTicks(invent2);

function setTicks (midi) {
    for (let i = 0; i < midi.tracks.length; i++) {
        time.setAbsoluteTicks(midi.tracks[i]);
        time.setQuantization(midi.header.ticksPerBeat/16, midi.tracks[i]);
    }
}
