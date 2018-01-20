const {expect} = require('chai');
const teoria = require('teoria');
const {createTrack, midiToLayout} = require('../src/scribe');
const {setAbsoluteTicks, setQuantization} = require('../src/time');

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
            setQuantization(60, events);
            const track = createTrack(240, events, {name: 'testtrack'});
            expect(track.events.length).to.equal(4);
            expect(track.events[0].type).to.equal('rest');
            expect(track.events[0].duration).to.eql([{value: 4, dots: 0}]);
            expect(track.events[1]).instanceof(teoria.Note);
            expect(track.events[2].type).to.equal('rest');
            expect(track.events[2].duration).to.eql([{value: 16, dots: 0}]);
        });

        it('should group notes into chords', () => {
            const events = [
                {type: 'noteOn', noteNumber: 72, deltaTime: 0},
                {type: 'noteOn', noteNumber: 74, deltaTime: 0},
                {type: 'noteOff', noteNumber: 72, deltaTime: 240},
                {type: 'noteOff', noteNumber: 74, deltaTime: 240} // eight note
            ];
            setAbsoluteTicks(events);
            setQuantization(30, events);
            const track = createTrack(240, events, {name: 'testtrack'});
            expect(track.events.length).to.equal(1);
            expect(track.events[0].type).to.equal('chord');
        });
    });

    describe('midiToLayout', () => {
        const midi = {
            tracks: [
                [{type: 'timeSignature', numerator: 5, denominator: 8}],
                [{type: 'noteOn', value: 69}, {type: 'noteOff', value: 69}],
                [{type: 'noteOn', value: 72}, {type: 'noteOff', value: 72}]
            ]
        };
        it('should set name, title, and composer if passed as options', () => {
            const layout = midiToLayout(midi, {name: 'My Layout', title: 'Awesome song!', composer: 'Sean'});
            expect(layout.name).to.equal('My Layout');
            expect(layout.title).to.equal('Awesome song!');
            expect(layout.composer).to.equal('Sean');
        });

        it('should create the timeSignature from midi event', () => {
            const layout = midiToLayout(midi);
            expect(layout.timeSignatures[0]).to.eql({value: [5, 8], measure: 0, beat: 0});
        });

        it('should use numerator and denominator options over midi event', () => {
            const layout = midiToLayout(midi, {numerator: 6, denominator: 4});
            expect(layout.timeSignatures[0]).to.eql({value: [6, 4], measure: 0, beat: 0});
        });

        it('should create a line for each track with a noteOn event', () => {
            const layout = midiToLayout(midi);
            expect(layout.lines.length).to.equal(2);
        });
    });
});
