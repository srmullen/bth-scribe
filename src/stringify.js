function dotString (n) {
    if (!n) return '';
    if (n === 1) return '.';
    if (n === 2) return '..';
}

function note (key, event) {

}

function event (evnt) {
    if (evnt.type === 'rest') {
        return `r/${evnt.duration.value}${dotString(evnt.duration.dots)}`;
    } else if (evnt.type === 'chord') {
        const notes = evnt.notes.reduce((acc, note, i) => {
            return acc + note.scientific() + ' ';
        }, '');
        return `<${notes.slice(0, notes.length - 1)}>/${evnt.duration.value}${dotString(evnt.duration.dots)}`;
    } else {
        return `${evnt.scientific()}/${evnt.duration.value}${dotString(evnt.duration.dots)}`;
    }
}

function track (track) {
    const eventString = track.events.reduce((str, evnt, i) => {
        return str.concat(event(evnt) + `${(i+1) % 16 === 0 ? '\n' : ''} `);
    }, '');
    return `[${track.name} ${eventString}]`;
}

module.exports = {
    note,
    event,
    track
}
