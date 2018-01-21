const {expect} = require('chai');
const teoria = require('teoria');
const stringify = require('../src/stringify');
const {NOTES, MAJOR, MINOR, NOTE} = require('../src/constants');

describe('string', () => {
    describe('note to string', () => {
        it('should handle accidentals based on key', () => {
            expect(stringify.note(teoria.note.fromMIDI(41))).to.equal('F2');
            expect(stringify.note(teoria.note.fromMIDI(53), NOTES.CS)).to.equal('E#3');
            expect(stringify.note(teoria.note.fromMIDI(90), NOTES.Db)).to.equal('Gb6');
            expect(stringify.note(teoria.note.fromMIDI(82), NOTES.D)).to.equal('A#5');
            expect(stringify.note(teoria.note.fromMIDI(67), NOTES.DS)).to.equal('Fx4');
            expect(stringify.note(teoria.note.fromMIDI(104), NOTES.Eb)).to.equal('Ab7');
            expect(stringify.note(teoria.note.fromMIDI(104), NOTES.E)).to.equal('G#7');
            expect(stringify.note(teoria.note.fromMIDI(34), NOTES.F)).to.equal('Bb1');
            expect(stringify.note(teoria.note.fromMIDI(49), NOTES.FS)).to.equal('C#3');
            expect(stringify.note(teoria.note.fromMIDI(49), NOTES.Gb)).to.equal('Db3');
            expect(stringify.note(teoria.note.fromMIDI(66), NOTES.G)).to.equal('F#4');
            expect(stringify.note(teoria.note.fromMIDI(67), NOTES.GS)).to.equal('Fx4');
            expect(stringify.note(teoria.note.fromMIDI(75), NOTES.Ab)).to.equal('Eb5');
            expect(stringify.note(teoria.note.fromMIDI(56), NOTES.A)).to.equal('G#3');
            expect(stringify.note(teoria.note.fromMIDI(46), NOTES.AS)).to.equal('A#2');
            expect(stringify.note(teoria.note.fromMIDI(46), NOTES.Bb)).to.equal('Bb2');
            expect(stringify.note(teoria.note.fromMIDI(76), NOTES.B)).to.equal('E5');
        });

        it('should handle minor keys', () => {
            expect(stringify.note(teoria.note.fromMIDI(70), NOTES.D, MINOR)).to.equal('Bb4');
        });

        xit('should handle leading tones', () => {
            expect(stringify.note(teoria.note.fromMIDI(61), NOTES.D, MINOR)).to.equal('C#4');
        });
    });

    describe('event to string', () => {
        it('should convert rest events', () => {
            expect(stringify.event({type: 'rest', duration: [{value: 4, dots: 0}]}).trim()).to.equal('r/4');
            expect(stringify.event({type: 'rest', duration: [{value: 16, dots: 1}]}).trim()).to.equal('r/16.');
            expect(stringify.event({type: 'rest', duration: [{value: 1, dots: 2}]}).trim()).to.equal('r/1..');
        });

        it('should convert chord events', () => {
            expect(stringify.event({
                type: 'chord',
                notes: ['c3', 'e3', 'g#4'].map(teoria.note),
                duration: [{value: 4, dots: 0}]
            }, {}).trim()).to.equal('<C3 E3 G#4>/4');
        });
    });

    describe('track to string', () => {
        it('converts track name to string', () => {
            expect(stringify.track({name: 'track1', events: []})).to.equal('[track1 ]');
        });

        it('creates boethius notes', () => {
            const n1 = {type: NOTE, note: teoria.note('a4'), duration: [{value: 4, dots: 0}]};
            expect(stringify.track({name: 'track1', events: [n1]})).to.equal(
                '[track1 A4/4 ]'
            );
            const n2 = {type: NOTE, note: teoria.note('c#5'), duration: [{value: 8, dots: 1}]};
            expect(stringify.track({
                name: 'track1',
                events: [n1, n2]
            })).to.equal('[track1 A4/4 C#5/8. ]');
        });
    });
});
