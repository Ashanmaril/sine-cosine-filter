# sine-cosine-filter
Weird audio filter that runs channels through transformation where amplitudes are multiplied based off sine/cosine waves


Relies on [SoX](http://sox.sourceforge.net/) to convert between .dat and .wav

Runs on Node.js

Execution:  
`node filter.js <input data file name> <angle delta (optional)>`  
e.g.  
`node filter.js helo.dat 0.1`
