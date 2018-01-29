const {expect} = require('chai');
const teoria = require('teoria');
const {createTrack, midiToLayout} = require('../src/scribe');
const {setAbsoluteTicks, setQuantization} = require('../src/time');
const {NOTE, REST, CHORD} = require('../src/constants');

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
            expect(track.events[0].type).to.equal(REST);
            expect(track.events[0].duration).to.eql([{value: 4, dots: 0}]);
            expect(track.events[1].type).to.equal(NOTE);
            expect(track.events[2].type).to.equal(REST);
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

        it('should add startsAtTicks and durationTicks', () => {
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
            expect(track.events[0].startsAtTicks).to.equal(0);
            expect(track.events[0].durationTicks).to.equal(240);
            expect(track.events[1].startsAtTicks).to.equal(240);
            expect(track.events[1].durationTicks).to.equal(240);
            expect(track.events[2].startsAtTicks).to.equal(480);
            expect(track.events[2].durationTicks).to.equal(60);
        });
    });

    describe('midiToLayout', () => {
        const midi = {
            header: {ticksPerBeat: 240},
            tracks: [
                [{type: 'timeSignature', numerator: 5, denominator: 8}],
                [{type: 'noteOn', value: 69}, {type: 'noteOff', value: 69}],
                [{type: 'noteOn', value: 72}, {type: 'noteOff', value: 72}]
            ]
        };
        it('should set name, title, and composer if passed as options', () => {
            const layout = midiToLayout(midi, [], {name: 'My Layout', title: 'Awesome song!', composer: 'Sean'});
            expect(layout.name).to.equal('My Layout');
            expect(layout.title).to.equal('Awesome song!');
            expect(layout.composer).to.equal('Sean');
        });

        it('should create the timeSignature from midi event', () => {
            const layout = midiToLayout(midi, []);
            expect(layout.timeSignatures[0]).to.eql({value: [5, 8], measure: 0, beat: 0});
        });

        it('should use numerator and denominator options over midi event', () => {
            const layout = midiToLayout(midi, [], {numerator: 6, denominator: 4});
            expect(layout.timeSignatures[0]).to.eql({value: [6, 4], measure: 0, beat: 0});
        });

        it('should create a line for each track in bth', () => {
            const bth = [
                {events: [{type: NOTE, note: teoria.note(60), startsAtTicks: 0, durationTicks: 1}]},
                {events: [{type: NOTE, note: teoria.note(60), startsAtTicks: 1, durationTicks: 2}]}
            ];
            const layout = midiToLayout(midi, bth, {});
            expect(layout.lines.length).to.equal(2);
        });

        it('should add the correct voices to each line', () => {
            const bth = [
                {events: [{startsAtTicks: 0, durationTicks: 1}], name: 'trebleTrack'},
                {events: [{startsAtTicks: 1, durationTicks: 2}], name: 'bassTrack'}
            ];
            const layout = midiToLayout(midi, bth, {});
            expect(layout.lines[0].voices[0]).to.equal('trebleTrack');
            expect(layout.lines[1].voices[0]).to.equal('bassTrack');
        });

        it('should create the correct number of Systems/Measures', () => {
            const midi = {
                header: {ticksPerBeat: 240},
                tracks: [
                    [{type: 'timeSignature', numerator: 4, denominator: 4}]
                ]
            };
            const bth = [
                {events: [{type: NOTE, note: teoria.note(60), startsAtTicks: 960, durationTicks: 480}], name: 'trebleTrack'},
                {events: [{type: NOTE, note: teoria.note(60), startsAtTicks: 1440, durationTicks: 480}], name: 'bassTrack'}
            ];
            const layout = midiToLayout(midi, bth, {});
            expect(layout.systems.length).to.equal(1);
            expect(layout.systems[0].measures).to.equal(2);
        });

        it('should limit the measures in each system to measuresPerSystem', () => {
            const midi = {
                header: {ticksPerBeat: 240},
                tracks: [
                    [{type: 'timeSignature', numerator: 4, denominator: 4}]
                ]
            };
            const bth = [
                {events: [{type: NOTE, note: teoria.note(60), startsAtTicks: 960, durationTicks: 480}], name: 'trebleTrack'},
                {events: [{type: NOTE, note: teoria.note(60), startsAtTicks: 960 * 7, durationTicks: 60}], name: 'bassTrack'}
            ];
            const layout = midiToLayout(midi, bth, {measuresPerSystem: 3});
            expect(layout.systems.length).to.equal(3);
            expect(layout.systems[0].measures).to.equal(3);
            expect(layout.systems[1].measures).to.equal(3);
            expect(layout.systems[2].measures).to.equal(2);
            expect(layout.pages[0].systems).to.equal(3);
        });
    });
});
