const fs = require('fs');
const axios = require('axios');
const inquirer = require('inquirer');
const dotenv = require('dotenv');
const { exec } = require('child_process');
const { JSDOM } = require('jsdom');
dotenv.config();

const execCmd = {
    js: (dir, file, input) => `node ${dir}/${file} < ${dir}/${input}`,
    c: (dir, file, input) => `cc ${dir}/${file} && ./a.out < ${dir}/${input}`,
    py: (dir, file, input) => `python ${dir}/${file} < ${dir}/${input}`
}

const init = async () => {
    const answers = await inquirer.prompt([{
        type: 'number',
        name: 'year',
        message: 'Enter Advent of Code year:',
        validate: (input) => (input >= 2015 && input <= (new Date()).getFullYear()) ? true : "Invalid year"
    }, {
        type: 'input',
        name: 'cookie',
        message: 'Paste your cookie here. It will be used to fetch inputs.',
        validate: async (input) => {
            const resp = await axios.get('https://adventofcode.com/2019/day/1/input', {
                headers: {
                    'cookie': input
                }
            });
            return (resp.status === 200) ? true : "Invalid cookie value.";
        }
    }]);
    fs.writeFileSync('.env', `AOC_YEAR=${answers.year}\nAOC_COOKIE=${answers.cookie}`);
    console.log("Init successful");
}

const add = async () => {
    const answers = await inquirer.prompt([{
        type: 'number',
        name: 'date',
        message: 'Enter Date:',
        validate: (input) => {
            if (input < 1 || input > 25) {
                return "Invalid Date";
            }
            return true;
        }
    }, {
        type: 'list',
        name: 'template',
        message: 'Select template:',
        choices: () => {
            const templates = fs.readdirSync('./scripts/templates');
            return templates.map(file => ({
                name: file.split('.').slice(0, -1).join(' '),
                value: file
            }));
        }
    }]);
    if (!fs.existsSync(`./${answers.date}`)) {
        fs.mkdirSync(`./${answers.date}`);
    }
    const files = fs.readdirSync(`./${answers.date}`);
    const ext = answers.template.split('.').slice(-1)[0];
    const fileNumber = files.filter(file => file.split('.').slice(-1)[0] === ext)
                            .map(file => Number(file.split('.').slice(0, 1)[0]))
                            .sort((a, b) => b - a);
    fs.copyFileSync(
        `./scripts/templates/${answers.template}`,
        `./${answers.date}/${(fileNumber[0] || 0) + 1}.${ext}`
    );
}

const run = async (date, file, env) => {
    if (!date) {
        const answers = await inquirer.prompt([{
            type: 'list',
            name: 'date',
            message: 'Select Folder:',
            choices: () => fs.readdirSync('.', { withFileTypes: true })
                                .filter(dirent => dirent.isDirectory())
                                .map(dirent => dirent.name)
        }]);
        date = answers.date;
    }
    if (!fs.existsSync(`./${date}`)) {
        throw "Folder not found";
    }
    if (!file) {
        const answers = await inquirer.prompt([{
            type: 'list',
            name: 'file',
            message: 'Select File:',
            choices: () => fs.readdirSync(`./${date}`)
        }]);
        file = answers.file;
    }
    if (!fs.existsSync(`./${date}/${file}`)) {
        throw "File not found";
    }
    if (!fs.existsSync(`./${date}/input.txt`)) {
        try {
            const resp = await axios.get(
                `https://adventofcode.com/${env.AOC_YEAR}/day/${date}/input`,
                {
                    headers: {
                        cookie: env.AOC_COOKIE
                    },
                    responseType: 'arraybuffer'
                });
            fs.writeFileSync(`${date}/input.txt`, resp.data);
        } catch (e) {
            console.log(e);
        }
    }
    const ext = file.split('.').slice(-1)[0];
    if (execCmd[ext]) {
        const child = exec(execCmd[ext](date, file, 'input.txt'));
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    } else {
        throw "Don't know how to run this file :(";
    }
}

const runTest = async (date, file, env) => {
    if (!date) {
        const answers = await inquirer.prompt([{
            type: 'list',
            name: 'date',
            message: 'Select Folder:',
            choices: () => fs.readdirSync('.', { withFileTypes: true })
                                .filter(dirent => dirent.isDirectory())
                                .map(dirent => dirent.name)
        }]);
        date = answers.date;
    }
    if (!fs.existsSync(`./${date}`)) {
        throw "Folder not found";
    }
    if (!file) {
        const answers = await inquirer.prompt([{
            type: 'list',
            name: 'file',
            message: 'Select File:',
            choices: () => fs.readdirSync(`./${date}`)
        }]);
        file = answers.file;
    }
    if (!fs.existsSync(`./${date}/${file}`)) {
        throw "File not found";
    }
    const answer = await inquirer.prompt([{
        type: 'list',
        name: 'testInput',
        choices: async () => {
            console.log('Creating list of probable test inputs...');
            const resp = await axios.get(
                `https://adventofcode.com/${env.AOC_YEAR}/day/${date}`,
                {
                    headers: {
                        cookie: env.AOC_COOKIE
                    }
                });
            const dom = new JSDOM(resp.data);
            const codeBlocks = dom.window.document.querySelectorAll('code');
            const testblocks = [];
            for (let i = 0; i < codeBlocks.length; i++) {
                testblocks.push(codeBlocks[i].textContent.replace(/\n/g, ''));
            }
            const filterdList = testblocks.filter(testblock => testblock.length > 1)
                                    .map(item => item.toString())
                                    .reverse();
            return filterdList;
        }
    }]);
    fs.writeFileSync(`${date}/test.txt`, answer.testInput);
    const ext = file.split('.').slice(-1)[0];
    if (execCmd[ext]) {
        const child = exec(execCmd[ext](date, file, 'test.txt'));
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    } else {
        throw "Don't know how to run this file :(";
    }
}

const main = async (args) => {
    const env = {};
    Object.keys(process.env || []).filter(item => item.startsWith('AOC'))
        .forEach(variable => env[variable] = process.env[variable]);

    switch(args[2]) {
        case 'init':
            return init();

        case 'add':
            return add();

        case 'run':
            return run(args[3], args[4], env);

        case 'run-test':
            return runTest(args[3], args[4], env);

        default:
            throw "Command not found";
    }
}

main(process.argv).catch(e => console.error(e));
