const fs = require('fs');
const path = require('path');
const program = require('commander')
const parseMidi = require('midi-file').parseMidi;
const scribe = require('./scribe');
const {getKeyScale} = require('./utils');

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
    const output = scribe.midiToBth(midi, options);
    fs.writeFileSync(path.join(outdir, name + '.bth'), output);

    if (program.createLayout) {
        const layout = scribe.midiToLayout(midi, options);
        fs.writeFileSync(path.join(outdir, name + '-layout.bth'), JSON.stringify(layout, null, '\t'));
    }
} else if (program.indir) {
    const dir = fs.readdirSync(program.indir);
    dir.forEach(file => {
        const fullpath = path.join(program.indir, file);
        if (fs.lstatSync(fullpath).isFile() && path.parse(file).ext === '.mid') {
            const midi = fs.readFileSync(fullpath);

            const parsed = parseMidi(midi);
            const output = scribe.midiToBth(parsed);

            fs.writeFileSync(path.join(outdir, path.parse(file).name + '.bth'), output);
        }
    });
}
