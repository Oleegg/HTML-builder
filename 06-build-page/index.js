const fs = require('fs');
const { unlink, readdir, mkdir, writeFile, copyFile, rmdir, readFile } = require('fs/promises');
const path = require('path');

const arrStyles = [];
start();
async function start() {
    await founfFiles();
    await copyAll('assets');
    copyStyles();
    copyHtml();
}

async function founfFiles() {
    const all = await readdir(path.join(__dirname));
    for (const el of all) {
        if (el == 'project-dist') {
            await removeAll('project-dist');
        } else {
            await addFiles();
        }
    }
}

async function removeAll(removeParam) {
    try {
        const files = await readdir(path.join(__dirname, removeParam));
        for (const file of files) {
            if (file) {
                if (!!path.extname(file)) {
                    await unlink(path.join(__dirname, `${removeParam}/${file}`));
                } else {
                    const filesIn = await readdir(path.join(__dirname, `${removeParam}/${file}`));
                    if (filesIn) {
                        await removeAll(`${removeParam}/${file}`);
                    } else {
                        await rmdir(path.join(__dirname, `${removeParam}/${file}`));
                    }
                }
            } else {
                console.log('finish');
            }
        }
    } catch (e) {
        console.error(e);
    }
}

async function addFiles() {
    try {
        await mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
        await writeFile(path.join(__dirname, 'project-dist', 'style.css'), '');
    }
    catch (e) {
        console.error(e);
    }
}

async function copyAll(param) {
    try {
        const files = await readdir(path.join(__dirname, param));
        for (const file of files) {
            if (!!path.extname(file)) {
                await copyFile(path.join(__dirname, `${param}/${file}`), path.join(__dirname, `project-dist/${param}/${file}`));
            } else {
                await mkdir(path.join(__dirname, `project-dist/${param}/${file}`), { recursive: true });
                await copyAll(`${param}/${file}`);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

async function copyStyles() {
    try {
        const styleFiles = await readdir(path.join(__dirname, 'styles'));
        for (const file of styleFiles) {
            if (path.extname(file) == '.css') {
                const reatableStream = fs.createReadStream(path.join(__dirname, `./styles/${file}`), 'utf-8');
                reatableStream.on('data', chunk => {
                    arrStyles.push(chunk);
                });
                reatableStream.on('error', error => console.log('Error', error.message));
                reatableStream.on('end', () => {
                    const writebleStream = fs.createWriteStream(path.join(__dirname, `./project-dist/style.css`));
                    writebleStream.on('error', function (err) { throw err });
                    arrStyles.forEach(el => writebleStream.write(el + '\n'));
                    writebleStream.end();
                });
            }
        }
    } catch (e) {
        console.error(e);
    }
}

async function copyHtml() {
    const componentArr = await readdir(path.join(__dirname, 'components'));
    const componentText = componentArr.map(el => `{{${path.parse(el).name}}}`);
    let tempHtml = '';
    const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
    readStream.on('data', chank => tempHtml += chank);
    readStream.on('error', err => console.log(err));
    readStream.on('end', async () => {
        let arrHtml = tempHtml.split('\r\n');
        const writeeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
        for (let i = 0; i < arrHtml.length; i++) {
            let findeComp = arrHtml[i].slice(arrHtml[i].indexOf('{{'), arrHtml[i].indexOf('}}') + 2);
            if (componentText.includes(findeComp)) {
                findeComp = await readFile(path.join(__dirname, 'components', findeComp.slice(2, findeComp.length - 2) + '.html'), 'utf-8');
                writeeStream.write(findeComp + '\r\n');
            } else {
                writeeStream.write(arrHtml[i] + '\r\n');
            }
        }
        writeeStream.end();
    });
}






