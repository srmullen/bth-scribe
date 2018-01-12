const {expect} = require('chai');
const teoria = require('teoria');
const {ticksToDuration, trackToString} = require('../src/utils');

describe('Tests', () => {
    describe('ticksToDuration', () => {
        it('should return an object', () => {
            const duration = expect(typeof ticksToDuration(120, 120)).to.equal('object');
        });

        it('should handle whole notes', () => {
            expect(ticksToDuration(120, 480)).to.eql({value: 1, dots: 0});
            expect(ticksToDuration(240, 960)).to.eql({value: 1, dots: 0});
            expect(ticksToDuration(96, 384)).to.eql({value: 1, dots: 0});
        });

        it('should handle half notes', () => {
            expect(ticksToDuration(120, 240)).to.eql({value: 2, dots: 0});
            expect(ticksToDuration(240, 480)).to.eql({value: 2, dots: 0});
            expect(ticksToDuration(96, 192)).to.eql({value: 2, dots: 0});
        });

        it('should handle quarter notes', () => {
            expect(ticksToDuration(120, 120)).to.eql({value: 4, dots: 0});
            expect(ticksToDuration(240, 240)).to.eql({value: 4, dots: 0});
            expect(ticksToDuration(96, 96)).to.eql({value: 4, dots: 0});
        });

        it('should handle eight notes', () => {
            expect(ticksToDuration(120, 60)).to.eql({value: 8, dots: 0});
            expect(ticksToDuration(240, 120)).to.eql({value: 8, dots: 0});
            expect(ticksToDuration(96, 48)).to.eql({value: 8, dots: 0});
        });

        it('should handle sixteenth notes', () => {
            expect(ticksToDuration(120, 30)).to.eql({value: 16, dots: 0});
            expect(ticksToDuration(240, 60)).to.eql({value: 16, dots: 0});
            expect(ticksToDuration(96, 24)).to.eql({value: 16, dots: 0});
        });

        it('should handle thirtysecond notes', () => {
            expect(ticksToDuration(120, 15)).to.eql({value: 32, dots: 0});
            expect(ticksToDuration(240, 30)).to.eql({value: 32, dots: 0});
            expect(ticksToDuration(96, 12)).to.eql({value: 32, dots: 0});
        });

        describe("with one dot", () => {
            it('should handle whole notes', () => {
                expect(ticksToDuration(120, 480 * 1.5)).to.eql({value: 1, dots: 1});
                expect(ticksToDuration(240, 960 * 1.5)).to.eql({value: 1, dots: 1});
                expect(ticksToDuration(96, 384 * 1.5)).to.eql({value: 1, dots: 1});
            });

            it('should handle half notes', () => {
                expect(ticksToDuration(120, 240 * 1.5)).to.eql({value: 2, dots: 1});
                expect(ticksToDuration(240, 480 * 1.5)).to.eql({value: 2, dots: 1});
                expect(ticksToDuration(96, 192 * 1.5)).to.eql({value: 2, dots: 1});
            });

            it('should handle quarter notes', () => {
                expect(ticksToDuration(120, 120 * 1.5)).to.eql({value: 4, dots: 1});
                expect(ticksToDuration(240, 240 * 1.5)).to.eql({value: 4, dots: 1});
                expect(ticksToDuration(96, 96 * 1.5)).to.eql({value: 4, dots: 1});
            });

            it('should handle eight notes', () => {
                expect(ticksToDuration(120, 60 * 1.5)).to.eql({value: 8, dots: 1});
                expect(ticksToDuration(240, 120 * 1.5)).to.eql({value: 8, dots: 1});
                expect(ticksToDuration(96, 48 * 1.5)).to.eql({value: 8, dots: 1});
            });

            it('should handle sixteenth notes', () => {
                expect(ticksToDuration(120, 30 * 1.5)).to.eql({value: 16, dots: 1});
                expect(ticksToDuration(240, 60 * 1.5)).to.eql({value: 16, dots: 1});
                expect(ticksToDuration(96, 24 * 1.5)).to.eql({value: 16, dots: 1});
            });

            it('should handle thirtysecond notes', () => {
                expect(ticksToDuration(120, 15 * 1.5)).to.eql({value: 32, dots: 1});
                expect(ticksToDuration(240, 30 * 1.5)).to.eql({value: 32, dots: 1});
                expect(ticksToDuration(96, 12 * 1.5)).to.eql({value: 32, dots: 1});
            });
        });

        describe("with two dots", () => {
            it('should handle whole notes', () => {
                expect(ticksToDuration(120, 480 * 1.75)).to.eql({value: 1, dots: 2});
                expect(ticksToDuration(240, 960 * 1.75)).to.eql({value: 1, dots: 2});
                expect(ticksToDuration(96, 384 * 1.75)).to.eql({value: 1, dots: 2});
            });

            it('should handle half notes', () => {
                expect(ticksToDuration(120, 240 * 1.75)).to.eql({value: 2, dots: 2});
                expect(ticksToDuration(240, 480 * 1.75)).to.eql({value: 2, dots: 2});
                expect(ticksToDuration(96, 192 * 1.75)).to.eql({value: 2, dots: 2});
            });

            it('should handle quarter notes', () => {
                expect(ticksToDuration(120, 120 * 1.75)).to.eql({value: 4, dots: 2});
                expect(ticksToDuration(240, 240 * 1.75)).to.eql({value: 4, dots: 2});
                expect(ticksToDuration(96, 96 * 1.75)).to.eql({value: 4, dots: 2});
            });

            it('should handle eight notes', () => {
                expect(ticksToDuration(120, 60 * 1.75)).to.eql({value: 8, dots: 2});
                expect(ticksToDuration(240, 120 * 1.75)).to.eql({value: 8, dots: 2});
                expect(ticksToDuration(96, 48 * 1.75)).to.eql({value: 8, dots: 2});
            });

            it('should handle sixteenth notes', () => {
                expect(ticksToDuration(120, 30 * 1.75)).to.eql({value: 16, dots: 2});
                expect(ticksToDuration(240, 60 * 1.75)).to.eql({value: 16, dots: 2});
                expect(ticksToDuration(96, 24 * 1.75)).to.eql({value: 16, dots: 2});
            });

            it('should handle thirtysecond notes', () => {
                expect(ticksToDuration(120, 15 * 1.75)).to.eql({value: 32, dots: 2});
                expect(ticksToDuration(240, 30 * 1.75)).to.eql({value: 32, dots: 2});
                expect(ticksToDuration(96, 12 * 1.75)).to.eql({value: 32, dots: 2});
            });
        });

        describe('tuplets', () => {

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
