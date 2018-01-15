const teoria = require('teoria');
const {ticksToDuration, trackToString, setAbsoluteTicks, setQuantization} = require('./utils');

function midiToBth (midi) {
    // Stop execution if midi is wrong format.
    if (midi.header.format !== 1) throw new Error("Incorrect midi format. Only format 1 supported");

    const timeSignature = midi.tracks[0].find(e => e.type === 'timeSignature');
    // sixtyfourth note quantization.
    const QUANTIZATION = midi.header.ticksPerBeat / 16;

    // Check that quantization value isn't fractional.
    if (Math.floor(QUANTIZATION) !== QUANTIZATION) throw new Error(`Bad quantization value: ${QUANTIZATION}`);

    const tracks = [];
    for (let i = 0; i < midi.header.numTracks; i++) {
        setAbsoluteTicks(midi.tracks[i]);
        setQuantization(QUANTIZATION, midi.tracks[i]);
        tracks.push(createTrack(`track${i}`, midi.tracks[i]));
    }

    const output = tracks.reduce((str, track) => {
        return str + trackToString(track) + '\n\n';
    }, '');

    return output;

    function createTrack (name, events) {
        const notes = events.reduce((acc, event, i) => {
            if (event.type === 'noteOn') {
                acc.currentEvent = event;
            } else if (event.type === 'noteOff') {
                const note = teoria.note.fromMIDI(event.noteNumber);
                note.duration = ticksToDuration(midi.header.ticksPerBeat, event.deltaTime);
                // const ticks = event.quantizedTime - acc.currentEvent.quantizedTime;
                // console.log(event.quantizedTime, ticks);
                // note.duration = ticksToDuration(midi.header.ticksPerBeat, ticks);
                acc.events = acc.events.concat(note);
            }
            return acc;
        }, {events: [], currentNote: null, name});
        return notes;
    }
}

module.exports = {
    midiToBth
}
