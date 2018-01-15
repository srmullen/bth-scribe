function dotString (n) {
    if (!n) return '';
    if (n === 1) return '.';
    if (n === 2) return '.';
}

function trackToString (track) {
    const eventString = track.events.reduce((str, event, i) => {
        return str.concat(event.scientific() +
        `/${event.duration.value}${dotString(event.duration.dots)}${(i+1) % 16 === 0 ? '\n' : ''} `);
    }, '');
    return `[${track.name} ${eventString}]`;
}

module.exports = {
    trackToString
}
