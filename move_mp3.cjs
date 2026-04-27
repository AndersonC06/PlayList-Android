const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (f === 'node_modules' || f === '.git' || f === 'dist') return;
    let isDirectory = false;
    try { isDirectory = fs.statSync(dirPath).isDirectory(); } catch (e) {}
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

console.log("Searching for mp3...");
walkDir(__dirname, function(filePath) {
  if (filePath.endsWith('.mp3')) {
    console.log("Found:", filePath);
  }
});
console.log("Search complete.");
