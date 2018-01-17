function dotString (n) {
    if (!n) return '';
    if (n === 1) return '.';
    if (n === 2) return '..';
}

function eventToString (event) {
    if (event.type === 'rest') {
        return `r/${event.duration.value}${dotString(event.duration.dots)}`;
    } else if (event.type === 'chord') {
        const notes = event.notes.reduce((acc, note, i) => {
            return acc + note.scientific() + ' ';
        }, '');
        return `<${notes.slice(0, notes.length - 1)}>/${event.duration.value}${dotString(event.duration.dots)}`;
    } else {
        return `${event.scientific()}/${event.duration.value}${dotString(event.duration.dots)}`;
    }
}

function trackToString (track) {
    const eventString = track.events.reduce((str, event, i) => {
        return str.concat(eventToString(event) + `${(i+1) % 16 === 0 ? '\n' : ''} `);
    }, '');
    return `[${track.name} ${eventString}]`;
}

module.exports = {
    eventToString,
    trackToString
}
