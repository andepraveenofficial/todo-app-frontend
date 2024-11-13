const fs = require('fs').promises;
const path = require('path');

async function readFilesRecursively(dirPath) {
  const fileContents = {};

  async function processDirectory(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.isFile()) {
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          const relativePath = path.relative(dirPath, fullPath);
          fileContents[relativePath] = content;
        } catch (error) {
          console.error(`Error reading file ${fullPath}:`, error);
        }
      }
    }
  }

  await processDirectory(dirPath);
  return fileContents;
}

async function main() {
  try {
    const apiPath = path.join(__dirname, '..', 'src');
    const files = await readFilesRecursively(apiPath);

    await fs.mkdir('ai/output', { recursive: true });

    await fs.writeFile(
      'ai/output/apiFiles.json',
      JSON.stringify(files, null, 2),
      'utf-8'
    );

    console.log('Files have been read and saved to output/api-files.json');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
