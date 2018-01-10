const fs = require('fs');
const parseMidi = require('midi-file').parseMidi;
const teoria = require('teoria');

const file = fs.readFileSync('./midi/invent/invent4.mid');

const midi = parseMidi(file);

// Stop execution if midi is wrong format.
if (midi.header.format !== 1) throw new Error("Incorrect midi format. Only format 1 supported");

const tracks = [];
for (let i = 1; i < midi.header.numTracks; i++) {
    tracks.push(createTrack(`track_${i}`, midi.tracks[i]));
}

const output = tracks.reduce((str, track) => {
    return str + track + '\n';
}, '');

fs.writeFileSync('./output.bth', output);

function createTrack (name, events) {
    notes = events.reduce((acc, event) => {
        if (event.type === 'noteOn') {
            return acc.concat(teoria.note.fromMIDI(event.noteNumber).scientific() + ' ');
        }
        return acc;
    }, '');
    return `[${name} ${notes}]`;
}
