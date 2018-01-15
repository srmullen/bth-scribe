const {expect} = require('chai');
const teoria = require('teoria');
const {trackToString} = require('../src/string');

describe('string', () => {
    describe('trackToString', () => {
        it('converts track name to string', () => {
            expect(trackToString({name: 'track1', events: []})).to.equal('[track1 ]');
        });

        it('creates boethius notes', () => {
            expect(trackToString({name: 'track1', events: [teoria.note('a4')]})).to.equal(
                '[track1 A4/4 ]'
            );
            expect(trackToString({
                name: 'track1',
                events: [teoria.note('a4'), teoria.note('c#5', {value: 8, dots: 1})]
            })).to.equal('[track1 A4/4 C#5/8. ]');
        });
    });
});
