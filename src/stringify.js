const teoria = require('teoria');
const {NOTE, REST, CHORD, NOTES, MAJOR} = require('./constants');

function dotString (n) {
    if (!n) return '';
    if (n === 1) return '.';
    if (n === 2) return '..';
}

function durationToString (duration) {
    return `${duration.value}${dotString(duration.dots)}`;
}

function noteToString (note, key=NOTES.C, scale=MAJOR) {
    const enharmonics = [note, ...note.enharmonics()];
    const keyScale = teoria.note(key).scale(scale);
    const enharmonic = enharmonics.find(n => n.scaleDegree(keyScale) > 0);
    if (!enharmonic) {
        return note.scientific();
    } else {
        return enharmonic.scientific();
    }
}

function eventToString (event, options) {
    if (event.type === REST) {
        const rests = event.duration.reduce((acc, duration) => {
            return acc + 'r/' + durationToString(duration) + ' ';
        }, '');
        return rests;
    } else if (event.type === CHORD) {
        const chords = event.duration.reduce((acc, duration) => {
            const notes = event.notes.reduce((acc, note, i) => {
                return acc + noteToString(note, options.key, options.scale) + ' ';
            }, '');
            return acc + `<${notes.slice(0, notes.length - 1)}>/${durationToString(duration)}` + ' ';
        }, '');
        return chords;
    } else {
        const notes = event.duration.reduce((acc, duration) => {
            return acc + `${noteToString(event, options.key, options.scale)}/${durationToString(duration)} `;
        }, '');
        return notes;
    }
}

function trackToString (track, options = {}) {
    const eventString = track.events.reduce((str, event, i) => {
        return str.concat(eventToString(event, options) + `${(i+1) % 16 === 0 ? '\n' : ''}`);
    }, '');
    return `[${track.name} ${eventString}]`;
}

module.exports = {
    duration: durationToString,
    note: noteToString,
    event: eventToString,
    track: trackToString
}
