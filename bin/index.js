#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander')
const parseMidi = require('midi-file').parseMidi;
const scribe = require('../src/scribe');
const stringify = require('../src/stringify');
const {getKeyScale} = require('../src/utils');

program
    .version("0.0.1")
    .option("-f, --file <file>", "Midi file to parse into bth")
    .option("-i, --indir <indir>", "Directory containing midi files")
    .option("-o, --outdir <outdir>", "Directory to output bth file(s).")
    .option("-k, --key <key>", "Root of the scale. ex. CS, Bb")
    .option("-s, --scale <scale>", "Scale for deciding how to choose enharmonics. 'major' or 'minor'.")
    .option("-l, --createlayout", "Create layout file.")
    .parse(process.argv);

const outdir = program.outdir || './';

if (program.file) {
    const file = fs.readFileSync(program.file);
    const {name} = path.parse(program.file);
    const midi = parseMidi(file);
    const [key, scale] = getKeyScale(midi, program);

    const options = {
        key,
        scale
    };
    const bth = scribe.midiToBth(midi);
    fs.writeFileSync(path.join(outdir, name + '.bth'), stringify.bth(bth, options));

    if (program.createlayout) {
        const layoutName = name + '-layout.json';
        console.log(`Createing Layout: ${layoutName}`);
        const layout = scribe.midiToLayout(midi, bth, options);
        fs.writeFileSync(path.join(outdir, layoutName), JSON.stringify(layout, null, '\t'));
    }
} else if (program.indir) {
    const dir = fs.readdirSync(program.indir);
    console.log("Compiling Directory");
    dir.forEach(item => {
        const fullpath = path.join(program.indir, item);
        if (fs.lstatSync(fullpath).isFile() && path.parse(item).ext === '.mid') {
            const file = fs.readFileSync(fullpath);
            const {name} = path.parse(item);
            const midi = parseMidi(file);
            const [key, scale] = getKeyScale(midi, program);
            const options = {
                key,
                scale
            }
            const bth = scribe.midiToBth(midi);

            fs.writeFileSync(path.join(outdir, name + '.bth'), stringify.bth(bth, options));

            if (program.createlayout) {
                const layoutName = name + '-layout.json';
                console.log(`Createing Layout: ${layoutName}`);
                const layout = scribe.midiToLayout(midi, bth, options);
                fs.writeFileSync(path.join(outdir, layoutName), JSON.stringify(layout, null, '\t'));
            }
        }
    });
}
