const {expect} = require('chai');
const teoria = require('teoria');
const stringify = require('../src/stringify');

describe('string', () => {
    describe('note to string', () => {

    });

    describe('event to string', () => {
        it('should convert rest events', () => {
            expect(stringify.event({type: 'rest', duration: {value: 4, dots: 0}})).to.equal('r/4');
            expect(stringify.event({type: 'rest', duration: {value: 16, dots: 1}})).to.equal('r/16.');
            expect(stringify.event({type: 'rest', duration: {value: 1, dots: 2}})).to.equal('r/1..');
        });

        it('should convert chord events', () => {
            expect(stringify.event({
                type: 'chord',
                notes: ['c3', 'e3', 'g#4'].map(teoria.note),
                duration: {value: 4, dots: 0}
            })).to.equal('<C3 E3 G#4>/4');
        });
    });

    describe('track to string', () => {
        it('converts track name to string', () => {
            expect(stringify.track({name: 'track1', events: []})).to.equal('[track1 ]');
        });

        it('creates boethius notes', () => {
            expect(stringify.track({name: 'track1', events: [teoria.note('a4')]})).to.equal(
                '[track1 A4/4 ]'
            );
            expect(stringify.track({
                name: 'track1',
                events: [teoria.note('a4'), teoria.note('c#5', {value: 8, dots: 1})]
            })).to.equal('[track1 A4/4 C#5/8. ]');
        });
    });
});
