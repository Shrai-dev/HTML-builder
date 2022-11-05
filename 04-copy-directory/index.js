const path = require('path');
const fs = require('fs/promises');

const sourceDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

async function copyFiles(source, destination) {
  await fs.rm(destination, { recursive: true, force: true });
  const folderContent = await fs.readdir(source, { withFileTypes: true });
  await fs.mkdir(destination);
  for (const file of folderContent) {
    let sourcePath = path.join(source, file.name);
    let destinationPath = path.join(destination, file.name);
    if (file.isDirectory()) {
      await copyFiles(sourcePath, destinationPath);
    } else {
      fs.copyFile(sourcePath, destinationPath);
    }
  }
}

copyFiles(sourceDir, destinationDir);
