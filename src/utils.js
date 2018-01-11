// Convert number of ticks to the beat value.
// Returns a duration object.
function ticsToDuration (ticksPerBeat, deltaTime) {
    const value = (ticksPerBeat / deltaTime) * 4;

}

module.exports = {
    ticsToDuration
};
