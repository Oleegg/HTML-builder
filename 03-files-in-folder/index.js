const { readdir } = require('fs/promises')
const fs = require('fs')
const path = require('path')

const showListFiles = async () => {
    const files = await readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
    for (const file of files) {
        if (file.isFile()) {
            fs.stat(path.join(__dirname, `./secret-folder/${file.name}`), (err, stats) => {
                console.log(path.basename(file.name, path.extname(file.name)), '-', path.extname(file.name).slice(1), '-', stats.size, 'b')
            })
        }
    }
}
showListFiles()