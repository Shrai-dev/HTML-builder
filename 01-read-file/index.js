const path = require('path');
const fs = require('fs');

const absolutePath = path.join('01-read-file', 'text.txt');
const stream = fs.createReadStream(absolutePath);
let data = '';
stream.on('data', (chunk) => (data += chunk));
stream.on('end', () => console.log(data));
