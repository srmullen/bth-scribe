const {NOTES, MAJOR, MINOR} = require('./constants');

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

module.exports = {
    getKey
}
