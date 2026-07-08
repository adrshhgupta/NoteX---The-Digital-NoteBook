const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Remove JSX comments: {/* ... */}
  content = content.replace(/\{[\s\n]*\/\*[\s\S]*?\*\/[\s\n]*\}/g, '');
  
  // 2. Remove multi-line comments: /* ... */
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 3. Remove single-line comments: // ...
  // We can just find // and if it's not part of URL
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    let idx = line.indexOf('//');
    while (idx !== -1) {
      if (idx > 0 && (line[idx-1] === ':' || line[idx-1] === '\"' || line[idx-1] === '\'')) {
        idx = line.indexOf('//', idx + 2);
      } else {
        return line.substring(0, idx).trimEnd();
      }
    }
    return line;
  });
  content = newLines.join('\n');
  
  // Remove multiple empty lines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Processed:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        walkDir(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
      processFile(fullPath);
    }
  }
}

walkDir('c:/Users/reena/OneDrive/Desktop/Notex main/src');
processFile('c:/Users/reena/OneDrive/Desktop/Notex main/vite.config.ts');
