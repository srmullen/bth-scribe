const fs = require('fs');
const parseMidi = require('midi-file').parseMidi;
const scribe = require('./scribe');

const file = fs.readFileSync('./midi/invent/invent4.mid');
// const file = fs.readFileSync('./midi/Notes_and_Rests.mid');

const midi = parseMidi(file);
const output = scribe.midiToBth(midi);

fs.writeFileSync('./bth/output.bth', output);
