const DURATION_VALUES = [1, 2, 4, 8, 16, 32, 64, 128];
// Convert number of ticks to the beat value.
// Returns a duration object.
function ticsToDuration (ticksPerBeat, deltaTime) {
    const beatPercentage = ticksPerBeat / deltaTime;
    let dots = 0;
    let value;
    if (Math.floor(beatPercentage * 4) !== beatPercentage * 4) {
        // Check if it is a dotted durtation
        const reduced = ticksPerBeat / (deltaTime / 1.5) * 4;
        if (DURATION_VALUES.indexOf(reduced) > -1) {
            value = reduced
            dots = 1;
        }
    } else {
        value = beatPercentage * 4;
    }
    return {value, dots};
}

module.exports = {
    ticsToDuration
};
