const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin, stdout } = require('process');

const absolutePath = path.join('02-write-file', 'text.txt');
const result = fs.createWriteStream(absolutePath);
const rl = readline.createInterface({ input: stdin, output: stdout });

stdout.write('Enter your question about Node.js\n');
result.write('Enter your question about Node.js\n');

rl.on('line', (input) => {
  if (input === 'exit') {
    process.exit();
  } else {
    result.write(`Your question: ${input}\n`);
    stdout.write(`Your question: ${input}\n`);
    stdout.write('Next question\n');
  }
});

rl.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => stdout.write('Have a nice day!'));
