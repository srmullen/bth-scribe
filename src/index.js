const fs = require('fs');
const parseMidi = require('midi-file').parseMidi;
const teoria = require('teoria');
const {ticksToDuration, trackToString} = require('./utils');

const file = fs.readFileSync('./midi/invent/invent4.mid');

const midi = parseMidi(file);

// Stop execution if midi is wrong format.
if (midi.header.format !== 1) throw new Error("Incorrect midi format. Only format 1 supported");

const timeSignature = midi.tracks[0].find(e => e.type === 'timeSignature');

const tracks = [];
for (let i = 1; i < midi.header.numTracks; i++) {
    tracks.push(createTrack(`track${i}`, midi.tracks[i]));
}

const output = tracks.reduce((str, track) => {
    return str + trackToString(track) + '\n\n';
}, '');

fs.writeFileSync('./bth/output.bth', output);

function createTrack (name, events) {
    const notes = events.reduce((acc, event, i) => {
        if (event.type === 'noteOn') {
            acc.currentEvent = event;
        } else if (event.type === 'noteOff') {
            const note = teoria.note.fromMIDI(event.noteNumber);
            note.duration = ticksToDuration(midi.header.ticksPerBeat, event.deltaTime);
            acc.events = acc.events.concat(note);
        }
        return acc;
    }, {events: [], currentNote: null, name});
    return notes;
}
