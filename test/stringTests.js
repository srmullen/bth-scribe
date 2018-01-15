const {expect} = require('chai');
const teoria = require('teoria');
const {eventToString, trackToString} = require('../src/string');

describe('string', () => {
    describe('eventToString', () => {
        it('should convert rest events', () => {
            expect(eventToString({type: 'rest', duration: {value: 4, dots: 0}})).to.equal('r/4');
            expect(eventToString({type: 'rest', duration: {value: 16, dots: 1}})).to.equal('r/16.');
            expect(eventToString({type: 'rest', duration: {value: 1, dots: 2}})).to.equal('r/1..');
        });
    });

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
