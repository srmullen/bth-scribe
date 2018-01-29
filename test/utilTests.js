const {expect} = require('chai');
const {getKey, getClefForNotes} = require('../src/utils');
const {NOTES, MAJOR, MINOR, TREBLE, BASS} = require('../src/constants');

describe('utils', () => {
    describe('getKey', () => {
        it('should return correct key when scale is major', () => {
            expect(getKey(0, 0)).to.eql([NOTES.C, MAJOR]);
            expect(getKey(-1, 0)).to.eql([NOTES.F, MAJOR]);
            expect(getKey(-6, 0)).to.eql([NOTES.Gb, MAJOR]);
            expect(getKey(1, 0)).to.eql([NOTES.G, MAJOR]);
            expect(getKey(7, 0)).to.eql([NOTES.CS, MAJOR]);
        });

        it('should return correct key when scale is major', () => {
            expect(getKey(0, 1)).to.eql([NOTES.A, MINOR]);
            expect(getKey(-1, 1)).to.eql([NOTES.D, MINOR]);
            expect(getKey(-6, 1)).to.eql([NOTES.Eb, MINOR]);
            expect(getKey(1, 1)).to.eql([NOTES.E, MINOR]);
            expect(getKey(7, 1)).to.eql([NOTES.AS, MINOR]);
        });
    });


    describe('getClefForNotes', () => {
        it('should return treble if the average note is above middle C', () => {
            expect(getClefForNotes([70, 59])).to.equal(TREBLE);
            expect(getClefForNotes([61, 50])).to.equal(BASS);
            expect(getClefForNotes([60])).to.equal(TREBLE);
        });
    });
});
