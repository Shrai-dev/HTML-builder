const path = require('path');
const fs = require('fs');

fs.rm(
  path.join(__dirname, 'project-dist', 'bundle.css'),
  {
    recursive: true,
    force: true,
  },
  () => {}
);

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) {
    throw err;
  } else {
    files.forEach((file) => {
      fs.stat(path.join(__dirname, 'styles', file), (err, stats) => {
        if (err) throw err;
        if (stats.isFile() && path.extname(file) === '.css') {
          const input = fs.createReadStream(
            path.join(__dirname, 'styles', file),
            { encoding: 'utf-8', flags: 'r' }
          );
          const output = fs.createWriteStream(
            path.join(__dirname, 'project-dist', 'bundle.css'),
            { encoding: 'utf-8', flags: 'a' }
          );
          input.pipe(output);
        }
      });
    });
  }
});
