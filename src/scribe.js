const teoria = require('teoria');
const {max, last} = require('lodash');
const {ticksToDuration, setAbsoluteTicks, setQuantization, getMeasuresFromTicks} = require('./time');
const stringify = require('./stringify');
const {getKey} = require('./utils');
const {NOTE_ON, NOTE_OFF, NOTE, CHORD, REST, NOTES, MAJOR}= require('./constants');

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
        // Only create a track if it has noteOn events.
        if (midi.tracks[i].some(event => event.type === 'noteOn')) {
            setAbsoluteTicks(midi.tracks[i]);
            setQuantization(QUANTIZATION, midi.tracks[i]);
            const track = createTrack(midi.header.ticksPerBeat, midi.tracks[i], {
                name: `track${i}`
            });
            tracks.push(track);
        }
    }

    return tracks;
}

function createTrack (ticksPerBeat, events, options = {}) {
    const track = events.reduce((acc, event, i) => {
        if (event.type === NOTE_ON) {
            if (acc.previousEvent.quantizedTime !== event.quantizedTime) {
                // need to add rest.
                const deltaTime = event.quantizedTime - acc.previousEvent.quantizedTime;
                acc.events = acc.events.concat({
                    type: REST,
                    duration: ticksToDuration(ticksPerBeat, deltaTime),
                    startsAtTicks: acc.previousEvent.quantizedTime,
                    durationTicks: deltaTime
                });
            } else if (acc.previousEvent.type === NOTE_ON) {
                if (acc.chord) {
                    acc.chord.events.push(event);
                } else {
                    const chord = {
                        type: CHORD,
                        events: [acc.previousEvent, event],
                        notes: [],
                        startsAtTicks: acc.previousEvent.quantizedTime,
                    };
                    acc.chord = chord;
                }
            }
        } else if (event.type === NOTE_OFF) {
            const note = teoria.note.fromMIDI(event.noteNumber);
            const duration = ticksToDuration(ticksPerBeat, event.quantizedDelta);
            note.duration = duration;
            // NOTE: Notes are haveing a duration of Infinity due to quantized delta of 0.
            // Generally looks to be caused by trills.
            // if (!isFinite(note.duration[0].value)) {
            //     console.log(event.quantizedDelta);
            // }
            if (acc.chord) {
                acc.chord.notes.push(note);
                if (!acc.chord.durtationTicks) acc.chord.durationTicks = event.quantizedDelta;
                if (acc.chord.events.length === acc.chord.notes.length) {
                    if (!acc.chord.duration) {
                        acc.chord.duration = acc.chord.notes[0].duration;
                    }
                    acc.events = acc.events.concat(acc.chord);
                    acc.chord = null;
                }
            } else {
                acc.events = acc.events.concat({
                    type: NOTE,
                    note,
                    duration,
                    startsAtTicks: acc.previousEvent.quantizedTime,
                    durationTicks: event.quantizedDelta
                });
            }
        }
        acc.previousEvent = event;
        return acc;
    }, {
        events: [],
        previousEvent: {type: 'beginTrackCreate', absoluteTime: 0, quantizedTime: 0},
        chord: null,
        name: options.name
    });
    return track;
}

// Given a parsed midi file, returns a json layout.
function midiToLayout (midi, bth, options = {}) {
    const measuresPerSystem = options.measuresPerSystem || 4;
    const timeSignature = midi.tracks[0].find(e => e.type === 'timeSignature');
    const timeSignatures = [];
    if (timeSignature) timeSignatures.push({
        value: [
            options.numerator || timeSignature.numerator,
            options.denominator || timeSignature.denominator
        ],
        measure: 0,
        beat: 0
    });
    // Get the total duration in ticks to determine number of measures.
    const totalDuration = max(bth.map(track => {
        const lastEvent = last(track.events);
        return lastEvent.startsAtTicks + lastEvent.durationTicks;
    }));
    
    const nMeasures = getMeasuresFromTicks(midi.header.ticksPerBeat, totalDuration, timeSignature);
    const systems = [];

    for (let i = nMeasures; i > 0; i -= measuresPerSystem) {
        systems.push({
            "measures": i < measuresPerSystem ? i : measuresPerSystem,
            "lineSpacing": [],
            "length": 1200
        });
    }

    // Default to just one page for now.
    const pages = [{
        "systems": systems.length,
        "staffSpacing": []
    }];
    // Find tracks with noteOn events. They require lines.
    // const lineTracks = midi.tracks.filter(track => track.some(event => event.type === 'noteOn'));
    // TODO: Choose clef based on range of notes in track.
    const lines = bth.map((track) => {
        return {
            "name": "",
            "clefs": [{
                "value": "treble",
                "measure": 0,
                "beat": 0
            }],
            "keys": [{
                "root": options.key,
                "mode": options.scale,
                "measure": 0,
                "beat": 0
            }],
            "voices": [track.name]
        };
    });
    return {
        "name": options.name || '',
        "title": options.title || '',
        "composer": options.composer || '',
        "type": "score",
        timeSignatures,
        "currentPage": 0,
        pages,
        lines,
        systems
    };
}

module.exports = {
    midiToBth,
    midiToLayout,
    createTrack
}

// function createTrack (ticksPerBeat, events, options = {}) {
//     const track = events.reduce((acc, event, i) => {
//         if (event.type === NOTE_ON) {
//             if (acc.previousEvent.absoluteTime !== event.absoluteTime) {
//                 // need to add rest.
//                 const deltaTime = event.absoluteTime - acc.previousEvent.absoluteTime;
//                 acc.events = acc.events.concat({type: REST, duration: ticksToDuration(ticksPerBeat, deltaTime)});
//             } else if (acc.previousEvent.type === NOTE_ON) {
//                 if (acc.chord) {
//                     acc.chord.events.push(event);
//                 } else {
//                     const chord = {
//                         type: CHORD,
//                         events: [acc.previousEvent, event],
//                         notes: []
//                     };
//                     acc.chord = chord;
//                 }
//             }
//         } else if (event.type === NOTE_OFF) {
//             const note = teoria.note.fromMIDI(event.noteNumber);
//             note.duration = ticksToDuration(ticksPerBeat, event.deltaTime);
//
//             // const ticks = event.quantizedTime - acc.currentEvent.quantizedTime;
//             // console.log(event.quantizedTime, ticks);
//             // note.duration = ticksToDuration(midi.header.ticksPerBeat, ticks);
//             if (acc.chord) {
//                 acc.chord.notes.push(note);
//                 if (acc.chord.events.length === acc.chord.notes.length) {
//                     if (!acc.chord.duration) {
//                         acc.chord.duration = acc.chord.notes[0].duration;
//                     }
//                     acc.events = acc.events.concat(acc.chord);
//                     acc.chord = null;
//                 }
//             } else {
//                 acc.events = acc.events.concat(note);
//             }
//         }
//         acc.previousEvent = event;
//         return acc;
//     }, {
//         events: [],
//         previousEvent: {type: 'beginTrackCreate', absoluteTime: 0},
//         chord: null,
//         name: options.name
//     });
//     return track;
// }
