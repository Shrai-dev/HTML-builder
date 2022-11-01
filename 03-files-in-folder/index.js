const path = require('path');
const fs = require('fs');

const absolutePath = path.join('03-files-in-folder', 'secret-folder');

fs.readdir(absolutePath, (err, data) => {
  if (err) console.log(err);
  data.forEach((item) => {
    const pathToFile = path.join(absolutePath, item);
    fs.stat(pathToFile, (err, stats) => {
      if (err) console.log(err);
      else {
        if (stats.isFile()) {
          const extension = path.extname(pathToFile);
          console.log(
            `${path.basename(pathToFile, extension)} - ${extension.slice(
              1
            )} - ${stats.size}b`
          );
        }
      }
    });
  });
});
