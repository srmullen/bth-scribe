const teoria = require('teoria');
const {ticksToDuration, setAbsoluteTicks, setQuantization} = require('./time');
const stringify = require('./stringify');
const {NOTE_ON, NOTE_OFF, CHORD, REST}= require('./constants');

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
        tracks.push(createTrack(midi.header.ticksPerBeat, `track${i}`, midi.tracks[i]));
    }

    const output = tracks.reduce((str, track) => {
        return str + stringify.track(track) + '\n\n';
    }, '');

    return output;
}

function createTrack (ticksPerBeat, name, events) {
    const track = events.reduce((acc, event, i) => {
        if (event.type === NOTE_ON) {
            if (acc.previousEvent.absoluteTime !== event.absoluteTime) {
                // need to add rest.
                const deltaTime = event.absoluteTime - acc.previousEvent.absoluteTime;
                acc.events = acc.events.concat({type: REST, duration: ticksToDuration(ticksPerBeat, deltaTime)});
            } else if (acc.previousEvent.type === NOTE_ON) {
                if (acc.chord) {
                    acc.chord.events.push(event);
                } else {
                    const chord = {
                        type: CHORD,
                        events: [acc.previousEvent, event],
                        notes: []
                    };
                    acc.chord = chord;
                }
            }
        } else if (event.type === NOTE_OFF) {
            const note = teoria.note.fromMIDI(event.noteNumber);
            note.duration = ticksToDuration(ticksPerBeat, event.deltaTime);
            // const ticks = event.quantizedTime - acc.currentEvent.quantizedTime;
            // console.log(event.quantizedTime, ticks);
            // note.duration = ticksToDuration(midi.header.ticksPerBeat, ticks);
            if (acc.chord) {
                acc.chord.notes.push(note);
                if (acc.chord.events.length === acc.chord.notes.length) {
                    if (!acc.chord.duration) {
                        acc.chord.duration = acc.chord.notes[0].duration;
                    }
                    acc.events = acc.events.concat(acc.chord);
                    acc.chord = null;
                }
            } else {
                acc.events = acc.events.concat(note);
            }
        }
        acc.previousEvent = event;
        return acc;
    }, {
        events: [],
        previousEvent: {type: 'beginTrackCreate', absoluteTime: 0},
        chord: null,
        name});
    return track;
}

module.exports = {
    midiToBth,
    createTrack
}
