const DURATION_VALUES = [1, 2, 4, 8, 16, 32, 64, 128];
// Convert number of ticks to the beat value.
// Returns a duration object.
function ticksToDuration (ticksPerBeat, deltaTime) {
    const beatPercentage = (ticksPerBeat / deltaTime) * 4;
    if (Math.floor(beatPercentage) !== beatPercentage) {
        // Check if it is a single-dotted durtation
        let reduced = ticksPerBeat / (deltaTime / 1.5) * 4;
        if (DURATION_VALUES.indexOf(reduced) > -1) {
            return [{value: reduced, dots: 1}];
        }
        // Check if it is a double-dotted value
        reduced = ticksPerBeat / (deltaTime / 1.75) * 4;
        if (DURATION_VALUES.indexOf(reduced) > -1) {
            return [{value: reduced, dots: 2}];
        }

        // Check for tied values.
        if ((beatPercentage) < 1) {
            const wholeNoteTicks = ticksPerBeat * 4;
            const remaining = deltaTime - wholeNoteTicks;
            return [{value: 1, dots: 0}, ...ticksToDuration(ticksPerBeat, remaining)];
        }

        if (beatPercentage < 2) {
            const halfNoteTicks = ticksPerBeat * 2;
            const remaining = deltaTime - halfNoteTicks;
            return [{value: 2, dots: 0}, ...ticksToDuration(ticksPerBeat, remaining)];
        }

        if (beatPercentage < 4) {
            const noteTypeTicks = ticksPerBeat * 1;
            const remaining = deltaTime - noteTypeTicks;
            return [{value: 4, dots: 0}, ...ticksToDuration(ticksPerBeat, remaining)];
        }
    }
    return [{value: beatPercentage, dots: 0}];
}

// Sets the absoluteTime in ticks on each event of the given track.
function setAbsoluteTicks (track) {
    track.forEach((event, i) => {
        const previousTime = track[i-1] ? track[i-1].absoluteTime : 0;
        event.absoluteTime = event.deltaTime + previousTime;
    });
}

// Sets the quantizedTime and quantizedDelta in ticks (multiple of the level) on each event in the track.
// The track must have absoluteTime property.
function setQuantization (level, track) {
    track.forEach((event, i) => {
        const rem = event.absoluteTime % level;
        event.quantizedTime = rem > level / 2 ? event.absoluteTime + level - rem : event.absoluteTime - rem;
        event.quantizedDelta = event.deltaTime + (event.quantizedTime - event.absoluteTime);
    });
}

function getMeasuresFromTicks (ticksPerBeat, duration, timeSig={numerator: 4, denominator: 4}) {
    const beats = (duration / ticksPerBeat) * (timeSig.denominator / 4);
    return Math.ceil(beats / timeSig.numerator);
}

module.exports = {
    ticksToDuration,
    setAbsoluteTicks,
    setQuantization,
    getMeasuresFromTicks
};
