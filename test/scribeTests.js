const {expect} = require('chai');
const teoria = require('teoria');
const {createTrack} = require('../src/scribe');
const {setAbsoluteTicks} = require('../src/time');

describe('Scribe', () => {
    describe('createTrack', () => {
        it('should add rests', () => {
            const events = [
                // quarter note rest
                {type: 'noteOn', noteNumber: 72, deltaTime: 240}, // quarter note
                {type: 'noteOff', noteNumber: 72, deltaTime: 240},
                // sixteenth note rest
                {type: 'noteOn', noteNumber: 74, deltaTime: 60},
                {type: 'noteOff', noteNumber: 74, deltaTime: 420} // eight note
            ];
            setAbsoluteTicks(events);
            const track = createTrack(240, 'testtrack', events);
            expect(track.events.length).to.equal(4);
            expect(track.events[0].type).to.equal('rest');
            expect(track.events[0].duration).to.eql({value: 4, dots: 0});
            expect(track.events[1]).instanceof(teoria.Note);
            expect(track.events[2].type).to.equal('rest');
            expect(track.events[2].duration).to.eql({value: 16, dots: 0});
        });

        xit('should group notes into chords');
    });
});
