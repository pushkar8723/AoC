process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    const program = lines.map(line => {
        const inst = line.split(' ');
        const code = inst[0];
        const offset = parseInt(inst[1]);
        return { code, offset };
    });

    const exitOnLoop = (program) => {
        const visited = new Set();
        let acc = 0;
        let control = 0;
        while (!visited.has(control) && control < program.length) {
            visited.add(control);
            const { code, offset } = program[control];
            switch(code) {
                case 'acc':
                    acc += offset;
                    control++;
                    break;
                case 'nop':
                    control++;
                    break;
                case 'jmp':
                    control += offset;
                    break;
            }
        }
        return {
            hasLoop: control !== program.length,
            acc,
        };
    }
    
    console.log(exitOnLoop(program));

    for (let i = 0; i < program.length; i++) {
        const newProgram = [...program];
        if (newProgram[i].code === 'nop') {
            newProgram[i] = {
                ...newProgram[i],
                code: 'jmp',
            };
        } else if (newProgram[i].code === 'jmp') {
            newProgram[i] = {
                ...newProgram[i],
                code: 'nop',
            };
        } else {
            continue;
        }
        const result = exitOnLoop(newProgram);
        if (!result.hasLoop) {
            console.log(result);
            break;
        }
    }
});
