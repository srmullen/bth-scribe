const fs = require('fs');
const parseMidi = require('midi-file').parseMidi

const file = fs.readFileSync('./midi/invent/invent4.mid');

const midi = parseMidi(file);

// Stop execution if midi is wrong format.
if (midi.header.format !== 1) throw new Error("Incorrect midi format. Only format 1 supported");

const output = `hello from bth-scribe
`;

fs.writeFileSync('./output.bth', output);
