// Program: filter.js
// Author: Hayden Lueck
// Course: CS 427
// Date: 2018/11/13
// Assignment #3
// Description: This program is made to run in a Node.js environment.
//              The program's input takes a .dat file containing PCM
//              samples from an audio file, converted in SoX (Sound Exchange).
//              An optional third argument can be passed for the angle shift
//              that occurs between each sample scanned.
//              The program iterates over the samples and shifts the amplitudes
//              of each channel based on a sine wave for the first channel, and
//              a cosine wave for the second channel.
//-----------------------------------------------------------------------------

const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');

const outputDataFile = 'filtered.dat';
const outputAudioFile = 'filtered.wav';

const fileName = process.argv[2] || '';
const angleIncrease = Number(process.argv[3]) || 0.1;

let angle = 0; // Initialize variable for storing angle as samples are stepped through

//-----------------------------------------------------------------------------
// Name: sineCosineFilter
// Purpose: Perform sine and cosine shifts on each of the respective
//          audio channels and write them to the output stream
// Params: params - an array of 3 numbers
//              1. Timestamp of sample
//              2. First channel amplitude
//              3. Second channel amplitude
// Return: void
function sineCosineFilter(params) {
    // Just write out the first argument, since it's just the timestamp
    writeStream.write(params[0] + ' ');
    // Grab the sample from the first channel, multiply it by sine of the angle,
    // write it to the output stream
    let sample = Number(params[1]);
    sample = sample * Math.sin(angle);
    writeStream.write(sample + ' ');
    // Grab the sample from the second channel, multiply it by cosine of the angle,
    // write it to the output stream
    sample = Number(params[2]);
    sample = sample * Math.cos(angle);
    // Drop a line break
    writeStream.write(sample + '\n');
    // Up the angle by the specified angle increase
    angle += angleIncrease;
}

//-----------------------------------------------------------------------------
// Name: convertToWav
// Purpose: Converts the output .dat file to a .wav file with SoX
// Params: None
// Return: void
function convertToWav() {
    exec(`sox ${outputDataFile} ${outputAudioFile}`, () => console.log(`Output to ${outputAudioFile}`));
}

//-----------------------------------------------------------------------------
// BEGINNING OF EXECUTION
//-----------------------------------------------------------------------------

// Check if file name was provided, exit if not
if (!fileName) {
    console.error('Error reading input file');
    process.exit();
}
// Clear the contents of the output .dat file (if exists)
fs.truncate(outputDataFile, 0, () => console.log(`Cleared file: ${outputDataFile}`))
// Create a writestream to write to the output .dat file
const writeStream = fs.createWriteStream(outputDataFile, {flags: 'a'});

// Create stream for reading file line-by-line
const rl = readline.createInterface({
    input: fs.createReadStream(fileName)
});

// Handler for every line read
rl.on('line', line => {
    // Create array from line
    //  -replace multiple spaces with single space
    //  -trim spaces
    //  -make array by splitting where there's a space
    const lineParams = line.replace(/\s\s+/g, ' ').trim().split(' ');
    if (lineParams[0] === ';') {
        // Handle first few lines of header data, just write it to output file
        writeStream.write(line + '\n');
    } else {
        // Otherwise, pass parameters of the current line to the filter
        sineCosineFilter(lineParams);
    }
});

// Handler for when read stream is closed/finished
rl.on('close', () => {
    console.log('done');
    convertToWav();
})
