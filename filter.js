const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');

const outputDataFile = 'filtered.dat';
const outputAudioFile = 'filtered.wav';

const fileName = process.argv[2] || '';
const angleIncrease = Number(process.argv[3]) || 0.1;

let angle = 0;

function sineCosineFilter(params) {
    writeStream.write(params[0] + ' ');
    let sample = Number(params[1]);
    sample = sample * Math.sin(angle);
    writeStream.write(sample + ' ');
    sample = Number(params[2]);
    sample = sample * Math.cos(angle);
    writeStream.write(sample + '\n');
    angle += angleIncrease;
}

function convertToWav() {
    exec(`sox ${outputDataFile} ${outputAudioFile}`, () => console.log(`Output to ${outputAudioFile}`));
}

if (!fileName) {
    console.error("Error reading input file");
    process.exit();
}

fs.truncate(outputDataFile, 0, () => console.log(`Cleared file: ${outputDataFile}`))
const writeStream = fs.createWriteStream(outputDataFile, {flags: 'a'});

const rl = readline.createInterface({
    input: fs.createReadStream(fileName)
});
rl.on('line', line => {
    const lineParams = line.replace(/\s\s+/g, ' ').trim().split(' ');
    if (lineParams[0] === ';') {
        writeStream.write(line + '\n');
    } else {
        sineCosineFilter(lineParams);
    }
});
rl.on('close', () => {
    console.log('done');
    convertToWav();
})
