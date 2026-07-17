const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gm);
if (scripts) {
  scripts.forEach((s, i) => {
    const code = s.replace(/<script\b[^>]*>|<\/script>/g, '');
    fs.writeFileSync(`script_${i}.js`, code);
  });
  console.log('Extracted ' + scripts.length + ' scripts.');
} else {
  console.log('No scripts found.');
}
