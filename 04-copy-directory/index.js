const fs = require('fs')
const { readdir, copyFile } = require('fs/promises')
const path = require('path')


fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, err => {
    if (err) { throw err }
})
const listFiles = async () => {
    try {
        const files = await readdir(path.join(__dirname, 'files'));
        const filesCopy = await readdir(path.join(__dirname, 'files-copy'));

        for (const fileC of filesCopy) {
            fs.unlink(path.join(__dirname, `./files-copy/${fileC}`), err => {
                if (err) {
                    //.....
                }
            })
        }
        for (const file of files) {
            copyFile(path.join(__dirname, `./files/${file}`), path.join(__dirname, `./files-copy/${file}`))
        }
    }
    catch {
        console.log(new Error());
    }
}

listFiles()
