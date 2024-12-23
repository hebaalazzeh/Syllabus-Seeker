const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/module\.exports\s*=/g, 'export default');
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Updated: ${filePath}`);
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      traverseDirectory(filePath); // Recursively process subdirectories
    } else if (file.endsWith('.js')) { // Process only JavaScript files
      replaceInFile(filePath);
    }
  }
}

const rootDir = path.resolve(__dirname, './'); // Adjust if necessary
traverseDirectory(rootDir);
console.log('Conversion completed.');
