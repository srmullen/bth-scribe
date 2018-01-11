const {expect} = require('chai');
const {ticsToDuration} = require('../src/utils');

describe('Tests', () => {
    describe('ticsToDuration', () => {
        it('should return an object', () => {
            const duration = expect(typeof ticsToDuration(120, 120)).to.equal('object');
        });

        it('should handle whole notes', () => {
            expect(ticsToDuration(120, 480)).to.eql({value: 1, dots: 0});
            expect(ticsToDuration(240, 960)).to.eql({value: 1, dots: 0});
            expect(ticsToDuration(96, 384)).to.eql({value: 1, dots: 0});
        });

        it('should handle half notes', () => {
            expect(ticsToDuration(120, 240)).to.eql({value: 2, dots: 0});
            expect(ticsToDuration(240, 480)).to.eql({value: 2, dots: 0});
            expect(ticsToDuration(96, 192)).to.eql({value: 2, dots: 0});
        });

        it('should handle quarter notes', () => {
            expect(ticsToDuration(120, 120)).to.eql({value: 4, dots: 0});
            expect(ticsToDuration(240, 240)).to.eql({value: 4, dots: 0});
            expect(ticsToDuration(96, 96)).to.eql({value: 4, dots: 0});
        });

        it('should handle eight notes', () => {
            expect(ticsToDuration(120, 60)).to.eql({value: 8, dots: 0});
            expect(ticsToDuration(240, 120)).to.eql({value: 8, dots: 0});
            expect(ticsToDuration(96, 48)).to.eql({value: 8, dots: 0});
        });

        it('should handle sixteenth notes', () => {
            expect(ticsToDuration(120, 30)).to.eql({value: 16, dots: 0});
            expect(ticsToDuration(240, 60)).to.eql({value: 16, dots: 0});
            expect(ticsToDuration(96, 24)).to.eql({value: 16, dots: 0});
        });

        it('should handle thirtysecond notes', () => {
            expect(ticsToDuration(120, 15)).to.eql({value: 32, dots: 0});
            expect(ticsToDuration(240, 30)).to.eql({value: 32, dots: 0});
            expect(ticsToDuration(96, 12)).to.eql({value: 32, dots: 0});
        });

        describe("with one dot", () => {
            it('should handle whole notes', () => {
                expect(ticsToDuration(120, 480 * 1.5)).to.eql({value: 1, dots: 1});
                expect(ticsToDuration(240, 960 * 1.5)).to.eql({value: 1, dots: 1});
                expect(ticsToDuration(96, 384 * 1.5)).to.eql({value: 1, dots: 1});
            });

            it('should handle half notes', () => {
                expect(ticsToDuration(120, 240 * 1.5)).to.eql({value: 2, dots: 1});
                expect(ticsToDuration(240, 480 * 1.5)).to.eql({value: 2, dots: 1});
                expect(ticsToDuration(96, 192 * 1.5)).to.eql({value: 2, dots: 1});
            });

            it('should handle quarter notes', () => {
                expect(ticsToDuration(120, 120 * 1.5)).to.eql({value: 4, dots: 1});
                expect(ticsToDuration(240, 240 * 1.5)).to.eql({value: 4, dots: 1});
                expect(ticsToDuration(96, 96 * 1.5)).to.eql({value: 4, dots: 1});
            });

            it('should handle eight notes', () => {
                expect(ticsToDuration(120, 60 * 1.5)).to.eql({value: 8, dots: 1});
                expect(ticsToDuration(240, 120 * 1.5)).to.eql({value: 8, dots: 1});
                expect(ticsToDuration(96, 48 * 1.5)).to.eql({value: 8, dots: 1});
            });

            it('should handle sixteenth notes', () => {
                expect(ticsToDuration(120, 30 * 1.5)).to.eql({value: 16, dots: 1});
                expect(ticsToDuration(240, 60 * 1.5)).to.eql({value: 16, dots: 1});
                expect(ticsToDuration(96, 24 * 1.5)).to.eql({value: 16, dots: 1});
            });

            it('should handle thirtysecond notes', () => {
                expect(ticsToDuration(120, 15 * 1.5)).to.eql({value: 32, dots: 1});
                expect(ticsToDuration(240, 30 * 1.5)).to.eql({value: 32, dots: 1});
                expect(ticsToDuration(96, 12 * 1.5)).to.eql({value: 32, dots: 1});
            });
        });

        xdescribe("with two dots", () => {
            it('should handle whole notes', () => {
                expect(ticsToDuration(120, 480 * 1.5)).to.eql({value: 1, dots: 2});
                expect(ticsToDuration(240, 960 * 1.5)).to.eql({value: 1, dots: 2});
                expect(ticsToDuration(96, 384 * 1.5)).to.eql({value: 1, dots: 2});
            });

            it('should handle half notes', () => {
                expect(ticsToDuration(120, 240 * 1.5)).to.eql({value: 2, dots: 2});
                expect(ticsToDuration(240, 480 * 1.5)).to.eql({value: 2, dots: 2});
                expect(ticsToDuration(96, 192 * 1.5)).to.eql({value: 2, dots: 2});
            });

            it('should handle quarter notes', () => {
                expect(ticsToDuration(120, 120 * 1.5)).to.eql({value: 4, dots: 2});
                expect(ticsToDuration(240, 240 * 1.5)).to.eql({value: 4, dots: 2});
                expect(ticsToDuration(96, 96 * 1.5)).to.eql({value: 4, dots: 2});
            });

            it('should handle eight notes', () => {
                expect(ticsToDuration(120, 60 * 1.5)).to.eql({value: 8, dots: 2});
                expect(ticsToDuration(240, 120 * 1.5)).to.eql({value: 8, dots: 2});
                expect(ticsToDuration(96, 48 * 1.5)).to.eql({value: 8, dots: 2});
            });

            it('should handle sixteenth notes', () => {
                expect(ticsToDuration(120, 30 * 1.5)).to.eql({value: 16, dots: 2});
                expect(ticsToDuration(240, 60 * 1.5)).to.eql({value: 16, dots: 2});
                expect(ticsToDuration(96, 24 * 1.5)).to.eql({value: 16, dots: 2});
            });

            it('should handle thirtysecond notes', () => {
                expect(ticsToDuration(120, 15 * 1.5)).to.eql({value: 32, dots: 2});
                expect(ticsToDuration(240, 30 * 1.5)).to.eql({value: 32, dots: 2});
                expect(ticsToDuration(96, 12 * 1.5)).to.eql({value: 32, dots: 2});
            });
        });
    });
});
