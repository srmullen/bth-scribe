const fs = require('fs');
const path = require('path');
const program = require('commander')
const parseMidi = require('midi-file').parseMidi;
const scribe = require('./scribe');

program
    .version("0.0.1")
    .option("-f, --file <file>", "Midi file to parse into bth")
    .option("-i, --indir <indir>", "Directory containing midi files")
    .option("-o, --outdir <outdir>", "Directory to output bth file(s).")
    .parse(process.argv);

// const file = fs.readFileSync('./midi/invent/invent4.mid');
// const file = fs.readFileSync('./midi/Notes_and_Rests.mid');

if (program.file) {
    const file = fs.readFileSync(program.file);

    const midi = parseMidi(file);
    const output = scribe.midiToBth(midi);

    fs.writeFileSync('./bth/output.bth', output);
} else if (program.indir) {
    const dir = fs.readdirSync(program.indir);
    const outdir = program.outdir || './';
    dir.forEach(file => {
        const fullpath = path.join(program.indir, file);
        if (fs.lstatSync(fullpath).isFile() && path.parse(file).ext === '.mid') {
            const midi = fs.readFileSync(fullpath);

            const parsed = parseMidi(midi);
            const output = scribe.midiToBth(parsed);

            // fs.writeFileSync('./bth/output.bth', output);
            fs.writeFileSync(path.join(outdir, path.parse(file).name + '.bth'), output);
        }
    });
}
