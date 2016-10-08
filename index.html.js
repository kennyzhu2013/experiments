'use strict';

let fs = require('fs');

function walkDirectory(path='/') {
    fs.readdir(__dirname + path, (err, files) => {
        if (err) return console.error(err);
        writeIndex(path, files);
        files.forEach((file) => {
            fs.stat(__dirname + path + file, (err, stat) => {
                if (err) return console.error(err);
                if (stat && stat.isDirectory()) {
                    walkDirectory(path + file + '/');
                }
            });
        });
    });
}

function writeIndex(path, files) {
    if (files.includes('index.html') && !files.includes('.indexed')) return;
    files = files.filter(file => !file.startsWith('.'));
    let title = `Index of ${path}`;
    let relpath = path.slice(1);
    let list = files
        .unshift('../')
        .map(file => `<li><a href="${relpath}${file}">${file}</a></li>`)
        .join('')
    ;
    let index = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
        </head>
        <body>
            <h1>${title}</h1>
            <ul>${list}</ul>
            <cite>Page generated by index.html.js</cite>
        </body>
        </html>
    `;
    fs.writeFile(__dirname + path + 'index.html', index, err => {
        if (err) return console.error(err);
        console.log(`✓ wrote index for ${path}`);
        fs.writeFile(
            __dirname + path + '.indexed',
            new Date().toString(),
            err => {
                if (err) console.error(err);
                else console.log(`✓✓ wrote .indexed for ${path}`);
            }
        );
    });
}

walkDirectory();