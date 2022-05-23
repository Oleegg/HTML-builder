const process = require('process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');


const rl = readline.createInterface({ input, output });
fs.writeFile(path.join(__dirname, 'text.txt'), '', err => {
    if (err) throw err;
    console.log('Write your message');
})
rl.on('line', input => {
    if (input == 'exit') {
        console.log('Bye!');
        process.exit();
    }
    fs.appendFile(path.join(__dirname, 'text.txt'), `${input}\n`, err => {
        if (err) throw new Error(err);
    });
    console.log('Write new message or type exit');
});

process.on('beforeExit', () => console.log('Bye!'));
