const DURATION_VALUES = [1, 2, 4, 8, 16, 32, 64, 128];
// Convert number of ticks to the beat value.
// Returns a duration object.
function ticksToDuration (ticksPerBeat, deltaTime) {
    const beatPercentage = ticksPerBeat / deltaTime;
    if (Math.floor(beatPercentage * 4) !== beatPercentage * 4) {
        // Check if it is a single-dotted durtation
        let reduced = ticksPerBeat / (deltaTime / 1.5) * 4;
        if (DURATION_VALUES.indexOf(reduced) > -1) {
            return {value: reduced, dots: 1};
        }
        // Check if it is a double-dotted value
        reduced = ticksPerBeat / (deltaTime / 1.75) * 4;
        if (DURATION_VALUES.indexOf(reduced) > -1) {
            // value = reduced
            // dots = 1;
            return {value: reduced, dots: 2};
        }
    }
    return {value: beatPercentage * 4, dots: 0};
}

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
    ticksToDuration,
    trackToString
};
