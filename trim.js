const fs = require('fs');

let html = fs.readFileSync('izyaan-portfolio-v7 (5).html', 'utf8');

// Replace both ach-org and ach-wit divs completely
// We use a regex that handles potential whitespace and newlines nicely inside the div
html = html.replace(/\s*<div class="ach-(org|wit)">(.*?)<\/div>/g, '');

fs.writeFileSync('izyaan-portfolio-v7 (5).html', html);
console.log('Successfully trimmed HTML.');
