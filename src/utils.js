const {sum} = require('lodash');
const {NOTES, MAJOR, MINOR, TREBLE, BASS} = require('./constants');

const KEYS = [
    NOTES.Gb, NOTES.Db, NOTES.Ab, NOTES.Eb, NOTES.Bb, NOTES.F,
    NOTES.C,
    NOTES.G, NOTES.D, NOTES.A, NOTES.E, NOTES.B, NOTES.FS, NOTES.CS, NOTES.GS, NOTES.DS, NOTES.AS
];

const SCALES = [MAJOR, MINOR];

// Returns the key and scale given midi key and scale numbers.
function getKey (keyNum, scaleNum) {
    const keyIndex = keyNum + 6 + (scaleNum * 3);
    const key = KEYS[keyIndex];
    const scale = SCALES[scaleNum];
    return [key, scale];
}

function getKeyScale (midi, options) {
    const keySignatureEvent = midi.tracks[0].find(e => e.type === 'keySignature');
    let key, scale;
    if (keySignatureEvent) {
        [key, scale] = getKey(keySignatureEvent.key, keySignatureEvent.scale);
    } else {
        key = options.key || NOTES.C;
        scale = options.scale || MAJOR;
    }
    return [key, scale];
}

// Given the note midi numbers, returns the most appropriate clef.
// Currently only handles bass and treble clefs.
function getClefForNotes (notes) {
    const avg = sum(notes) / notes.length;
    if (avg >= 60) {
        return TREBLE;
    } else {
        return BASS;
    }
}

module.exports = {
    getKey,
    getKeyScale,
    getClefForNotes
}
