const fs = require('fs')
const path = require('path')

const arr = []
fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', err => {
    if (err) throw err
})

fs.readdir(path.join(__dirname, 'styles'), (err, data) => {
    if (err) throw err
    for (const file of data) {
        if (path.extname(file) == '.css') {
            const readableStream = fs.createReadStream(path.join(__dirname, `./styles/${file}`), 'utf-8')
            readableStream.on('data', chunk => {
                arr.push(chunk)
            });
            readableStream.on('error', error => console.log('Error', error.message));
            readableStream.on('end', data => {
                let writebleStream = fs.createWriteStream(path.join(__dirname, `./project-dist/bundle.css`));
                writebleStream.on('error', function (err) { throw err });
                arr.forEach(el => writebleStream.write(el + '\n'));
                writebleStream.end();
            })
        }
    }
})
