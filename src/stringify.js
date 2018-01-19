const teoria = require('teoria');
const {NOTE, REST, CHORD, NOTES, MAJOR} = require('./constants');

function dotString (n) {
    if (!n) return '';
    if (n === 1) return '.';
    if (n === 2) return '..';
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
        return `r/${event.duration.value}${dotString(event.duration.dots)}`;
    } else if (event.type === CHORD) {
        const notes = event.notes.reduce((acc, note, i) => {
            // return acc + note.scientific() + ' ';
            return acc + noteToString(note, options.key, options.scale) + ' ';
        }, '');
        return `<${notes.slice(0, notes.length - 1)}>/${event.duration.value}${dotString(event.duration.dots)}`;
    } else {
        return `${noteToString(event, options.key, options.scale)}/${event.duration.value}${dotString(event.duration.dots)}`;
    }
}

function trackToString (track, options = {}) {
    const eventString = track.events.reduce((str, event, i) => {
        return str.concat(eventToString(event, options) + `${(i+1) % 16 === 0 ? '\n' : ''} `);
    }, '');
    return `[${track.name} ${eventString}]`;
}

module.exports = {
    note: noteToString,
    event: eventToString,
    track: trackToString
}
