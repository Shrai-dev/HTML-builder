const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

fsPromises
  .rm(path.join(__dirname, 'project-dist'), {
    recursive: true,
    force: true,
  })
  .then(buildPage)
  .catch((err) => console.log(err));

function buildPage() {
  fs.mkdir(path.join(__dirname, 'project-dist'), () => {
    fs.readFile(path.join(__dirname, 'template.html'), (err, templateData) => {
      if (err) {
        throw err;
      }
      let templateInfo = templateData.toString();
      appendComponents(templateInfo);
    });
  });

  async function appendComponents(template) {
    const componentsFile = await fsPromises.readdir(
      path.join(__dirname, 'components'),
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
    for (const file of componentsFile) {
      fs.readFile(path.join(__dirname, 'components', file), (err, data) => {
        if (err) {
          throw err;
        }
        const fileName = file.split('.')[0];
        const fileData = data.toString();

        if (template.includes(fileName)) {
          template = template.replace(`{{${fileName}}}`, fileData);
          fs.writeFile(
            path.join(__dirname, 'project-dist', 'index.html'),
            template,
            (error) => {
              if (error) {
                console.log(`There occurred an error: ${error.message}`);
              }
            }
          );
        }
      });
    }
  }

  fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
    if (err) {
      throw err;
    } else {
      // fs.rm(path.join(__dirname, 'project-dist', 'style.css'), {
      //   recursive: true,
      //   force: true,
      // });
      files.forEach((file) => {
        fs.stat(path.join(__dirname, 'styles', file), (err, stats) => {
          if (err) throw err;
          if (stats.isFile() && path.extname(file) === '.css') {
            const input = fs.createReadStream(
              path.join(__dirname, 'styles', file),
              { encoding: 'utf-8', flags: 'r' }
            );
            const output = fs.createWriteStream(
              path.join(__dirname, 'project-dist', 'style.css'),
              { encoding: 'utf-8', flags: 'a' }
            );
            input.pipe(output);
          }
        });
      });
    }
  });

  async function copyFiles(source, destination) {
    await fsPromises.rm(destination, { recursive: true, force: true });
    const folderContent = await fsPromises.readdir(source, {
      withFileTypes: true,
    });
    await fsPromises.mkdir(destination);
    for (const file of folderContent) {
      let sourcePath = path.join(source, file.name);
      let destinationPath = path.join(destination, file.name);
      if (file.isDirectory()) {
        await copyFiles(sourcePath, destinationPath);
      } else {
        fsPromises.copyFile(sourcePath, destinationPath);
      }
    }
  }

  copyFiles(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets')
  );
}
