/**
 * Module for Intcode Machine.
 */
function intcode(input) {
    /** Program to be executed. */
    let program = input;

    /** Current address of the control */
    let control = 0;

    /**
     * Returns the value for the mode and param
     * @param {Number} mode 
     * @param {Number} param 
     */
    const getValue = (mode, param) => {
        switch(mode) {
            case 1:
                return param;
            default:
                return program[param];
        }
    }

    /**
     * Returns a set of values for the code and start position. 
     * @param {Number} code     Modes of current opcode
     * @param {Number} count    Number of values to be extracted
     * @param {Number} start    Start position of the params for current opcode
     */
    const getValues = (code, count, start) => {
        let mode;
        const output = [];
        for (let i = 0; i < count; i++) {
            mode = code % 10;
            code = Math.floor(code/10);
            output[i] = getValue(mode, program[start + i]);
        }
        return output
    }

    /**
     * Executes the program for the given input.
     * If input is required but input is not present or is empty,
     * the execution will have to be called again with input. Thus,
     * making the program wait for the input.
     * If an output is generated then the programs returns with a value
     * and done set to false, indicating further execution is possible.
     * If the program reaches halt opcode, it returns with done set to true.
     * Further execution will not do anything and will return done set to true.
     * @param {Array<Number>} inputs 
     */
    const exec = (inputs) => {
        if (!program) {
            throw "Machine not initialized.";
        }

        while(true) {
            const opcode = program[control] % 100;
            const modes = Math.floor(program[control] / 100);
            let values;
            switch(opcode) {
                /**
                 * ADD {P/N} {P/N} {P} 
                 * Adds the value given by first 2 params and saves
                 * it in the position given by 3rd param.
                 */
                case 1:
                    values = getValues(modes, 2, control + 1);
                    program[program[control + 3]] = values[0] + values[1];
                    control += 4;
                    break;

                /**
                 * MUL {P/N} {P/N} {P}
                 * Multiplies the value given by first 2 params and saves
                 * it in the position given by 3rd param.
                 */
                case 2:
                    values = getValues(modes, 2, control + 1);
                    program[program[control + 3]] = values[0] * values[1];
                    control += 4;
                    break;

                /**
                 * INP {P}
                 * Takes in a input and saves it a the position given by 2nd param.
                 */
                case 3:
                    if (inputs && inputs.length) {
                        console.log("Input received:", inputs[0]);
                        program[program[control + 1]] = inputs[0];
                        inputs.splice(0, 1);
                        control += 2;
                        break;
                    } else {
                        console.log("Program waiting for input...");
                        return { done: false };
                    }

                /**
                 * OUT {N}
                 * Returns the value given by 2nd param.
                 */
                case 4:
                    values = getValues(modes, 1, control + 1);
                    control += 2;
                    return { done: false, value: values[0] };

                /**
                 * JNZ {P/N} {P}
                 * Jump to the position given by second param if the value given
                 * by first param is not zero. 
                 */
                case 5:
                    values = getValues(modes, 2, control + 1);
                    if (values[0] !== 0) {
                        control = values[1];
                    } else {
                        control += 3;
                    }
                    break;

                /**
                 * JEZ {P/N} {P}
                 * Jump to the position given by second param if the value given
                 * by first param is zero.
                 */
                case 6:
                    values = getValues(modes, 2, control + 1);
                    if (values[0] == 0) {
                        control = values[1];
                    } else {
                        control += 3;
                    }
                    break;

                /**
                 * LTJ {P/N} {P/N} {P}
                 * Jump to the position given by the 3rd param if the value given by
                 * the first param is lest the value given by the second param.
                 */
                case 7:
                    values = getValues(modes, 2, control + 1);
                    program[program[control + 3]] = (values[0] < values[1]) ? 1 : 0;
                    control += 4;
                    break;

                /**
                 * EQJ {P/N} {P/N} {P}
                 * Jump to the position given by the 3rd param if the value given by
                 * the first and second params are equal.
                 */
                case 8:
                    values = getValues(modes, 2, control + 1);
                    program[program[control + 3]] = (values[0] === values[1]) ? 1 : 0;
                    control += 4;
                    break;

                /**
                 * HLT
                 * Halt program execution.
                 */
                case 99:
                    return { done: true };
                
                /**
                 * Program reached an invalid state.
                 */
                default:
                    throw "Invalid Opcode Exception";
            }
        }
    }

    const reset = (input) => {
        program = input;
        control = 0;
    } 

    return {
        exec,
        reset
    }
}

module.exports = {
    default: intcode
}