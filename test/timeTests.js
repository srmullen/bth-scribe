const {expect} = require('chai');
const teoria = require('teoria');
const {
    ticksToDuration, setAbsoluteTicks, setQuantization
} = require('../src/time');

describe('Tests', () => {
    describe('ticksToDuration', () => {
        it('should return an object', () => {
            const duration = expect(typeof ticksToDuration(120, 120)).to.equal('object');
        });

        it('should handle whole notes', () => {
            expect(ticksToDuration(120, 480)).to.eql([{value: 1, dots: 0}]);
            expect(ticksToDuration(240, 960)).to.eql([{value: 1, dots: 0}]);
            expect(ticksToDuration(96, 384)).to.eql([{value: 1, dots: 0}]);
        });

        it('should handle half notes', () => {
            expect(ticksToDuration(120, 240)).to.eql([{value: 2, dots: 0}]);
            expect(ticksToDuration(240, 480)).to.eql([{value: 2, dots: 0}]);
            expect(ticksToDuration(96, 192)).to.eql([{value: 2, dots: 0}]);
        });

        it('should handle quarter notes', () => {
            expect(ticksToDuration(120, 120)).to.eql([{value: 4, dots: 0}]);
            expect(ticksToDuration(240, 240)).to.eql([{value: 4, dots: 0}]);
            expect(ticksToDuration(96, 96)).to.eql([{value: 4, dots: 0}]);
        });

        it('should handle eight notes', () => {
            expect(ticksToDuration(120, 60)).to.eql([{value: 8, dots: 0}]);
            expect(ticksToDuration(240, 120)).to.eql([{value: 8, dots: 0}]);
            expect(ticksToDuration(96, 48)).to.eql([{value: 8, dots: 0}]);
        });

        it('should handle sixteenth notes', () => {
            expect(ticksToDuration(120, 30)).to.eql([{value: 16, dots: 0}]);
            expect(ticksToDuration(240, 60)).to.eql([{value: 16, dots: 0}]);
            expect(ticksToDuration(96, 24)).to.eql([{value: 16, dots: 0}]);
        });

        it('should handle thirtysecond notes', () => {
            expect(ticksToDuration(120, 15)).to.eql([{value: 32, dots: 0}]);
            expect(ticksToDuration(240, 30)).to.eql([{value: 32, dots: 0}]);
            expect(ticksToDuration(96, 12)).to.eql([{value: 32, dots: 0}]);
        });

        describe("with one dot", () => {
            it('should handle whole notes', () => {
                expect(ticksToDuration(120, 480 * 1.5)).to.eql([{value: 1, dots: 1}]);
                expect(ticksToDuration(240, 960 * 1.5)).to.eql([{value: 1, dots: 1}]);
                expect(ticksToDuration(96, 384 * 1.5)).to.eql([{value: 1, dots: 1}]);
            });

            it('should handle half notes', () => {
                expect(ticksToDuration(120, 240 * 1.5)).to.eql([{value: 2, dots: 1}]);
                expect(ticksToDuration(240, 480 * 1.5)).to.eql([{value: 2, dots: 1}]);
                expect(ticksToDuration(96, 192 * 1.5)).to.eql([{value: 2, dots: 1}]);
            });

            it('should handle quarter notes', () => {
                expect(ticksToDuration(120, 120 * 1.5)).to.eql([{value: 4, dots: 1}]);
                expect(ticksToDuration(240, 240 * 1.5)).to.eql([{value: 4, dots: 1}]);
                expect(ticksToDuration(96, 96 * 1.5)).to.eql([{value: 4, dots: 1}]);
            });

            it('should handle eight notes', () => {
                expect(ticksToDuration(120, 60 * 1.5)).to.eql([{value: 8, dots: 1}]);
                expect(ticksToDuration(240, 120 * 1.5)).to.eql([{value: 8, dots: 1}]);
                expect(ticksToDuration(96, 48 * 1.5)).to.eql([{value: 8, dots: 1}]);
            });

            it('should handle sixteenth notes', () => {
                expect(ticksToDuration(120, 30 * 1.5)).to.eql([{value: 16, dots: 1}]);
                expect(ticksToDuration(240, 60 * 1.5)).to.eql([{value: 16, dots: 1}]);
                expect(ticksToDuration(96, 24 * 1.5)).to.eql([{value: 16, dots: 1}]);
            });

            it('should handle thirtysecond notes', () => {
                expect(ticksToDuration(120, 15 * 1.5)).to.eql([{value: 32, dots: 1}]);
                expect(ticksToDuration(240, 30 * 1.5)).to.eql([{value: 32, dots: 1}]);
                expect(ticksToDuration(96, 12 * 1.5)).to.eql([{value: 32, dots: 1}]);
            });
        });

        describe("with two dots", () => {
            it('should handle whole notes', () => {
                expect(ticksToDuration(120, 480 * 1.75)).to.eql([{value: 1, dots: 2}]);
                expect(ticksToDuration(240, 960 * 1.75)).to.eql([{value: 1, dots: 2}]);
                expect(ticksToDuration(96, 384 * 1.75)).to.eql([{value: 1, dots: 2}]);
            });

            it('should handle half notes', () => {
                expect(ticksToDuration(120, 240 * 1.75)).to.eql([{value: 2, dots: 2}]);
                expect(ticksToDuration(240, 480 * 1.75)).to.eql([{value: 2, dots: 2}]);
                expect(ticksToDuration(96, 192 * 1.75)).to.eql([{value: 2, dots: 2}]);
            });

            it('should handle quarter notes', () => {
                expect(ticksToDuration(120, 120 * 1.75)).to.eql([{value: 4, dots: 2}]);
                expect(ticksToDuration(240, 240 * 1.75)).to.eql([{value: 4, dots: 2}]);
                expect(ticksToDuration(96, 96 * 1.75)).to.eql([{value: 4, dots: 2}]);
            });

            it('should handle eight notes', () => {
                expect(ticksToDuration(120, 60 * 1.75)).to.eql([{value: 8, dots: 2}]);
                expect(ticksToDuration(240, 120 * 1.75)).to.eql([{value: 8, dots: 2}]);
                expect(ticksToDuration(96, 48 * 1.75)).to.eql([{value: 8, dots: 2}]);
            });

            it('should handle sixteenth notes', () => {
                expect(ticksToDuration(120, 30 * 1.75)).to.eql([{value: 16, dots: 2}]);
                expect(ticksToDuration(240, 60 * 1.75)).to.eql([{value: 16, dots: 2}]);
                expect(ticksToDuration(96, 24 * 1.75)).to.eql([{value: 16, dots: 2}]);
            });

            it('should handle thirtysecond notes', () => {
                expect(ticksToDuration(120, 15 * 1.75)).to.eql([{value: 32, dots: 2}]);
                expect(ticksToDuration(240, 30 * 1.75)).to.eql([{value: 32, dots: 2}]);
                expect(ticksToDuration(96, 12 * 1.75)).to.eql([{value: 32, dots: 2}]);
            });
        });

        describe('tuplets', () => {

        });

        describe('Breaking up ties/rests.', () => {
            it('should handle whole notes.', () => {

            });

            it('should handle half notes.', () => {
                // half-note + sixteenth-note
                expect(ticksToDuration(240, 540)).to.eql([{value: 2, dots: 0}, {value: 16, dots: 0}]);
            });
        });
    });

    describe('setAbsoluteTicks', () => {
        it('takes an array of midi events and sets the absolute time in ticks on each event', () => {
            const track = [{deltaTime: 0}, {deltaTime: 10}, {deltaTime: 0}, {deltaTime: 20}, {deltaTime: 0}];
            setAbsoluteTicks(track);
            expect(track.map(event => event.absoluteTime)).to.eql([0, 10, 10, 30, 30]);
        });
    });

    describe('setQuantization', () => {
        it('should set quantizedTime and quantizedDelta properties', () => {
            // const track = setAbsoluteTicks([{deltaTime: 0}, {deltaTime: 10}, {deltaTime: 0}, {deltaTime: 20}, {deltaTime: 0}]);
            const track = [{deltaTime: 0, absoluteTime: 5}];
            setQuantization(5, track);
            expect(track[0].quantizedTime).to.equal(5);
            expect(track[0].quantizedDelta).to.equal(0);
        });

        it('should move a note onto the beat if it is early', () => {
            const track = [{deltaTime: 0, absoluteTime: 4}];
            setQuantization(5, track);
            expect(track[0].quantizedTime).to.equal(5)
            expect(track[0].quantizedDelta).to.equal(1)
        });

        it('should move a note onto the beat if it is late', () => {
            const track = [{deltaTime: 0, absoluteTime: 6}];
            setQuantization(5, track);
            expect(track[0].quantizedTime).to.equal(5)
            expect(track[0].quantizedDelta).to.equal(-1)
        });

        xit("should handle this", () => {
            const track = [{
                deltaTime: 0,
                channel: 0,
                type: 'noteOn',
                noteNumber: 72,
                velocity: 80
            }, {
                deltaTime: 1823,
                running: true,
                channel: 0,
                type: 'noteOff',
                noteNumber: 72,
                velocity: 0
            }]
            setAbsoluteTicks(track);
            setQuantization(480, track);
        });
    });
});
