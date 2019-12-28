/**
 * Module for Intcode Machine.
 */
function intcode(input) {
    /** Program to be executed. */
    let program = input;

    /** Current address of the control */
    let control = 0;

    /** Relative base of the system */
    let relativeBase = 0;

    /**
     * Returns the value for the mode and param
     * @param {Number} mode 
     * @param {Number} param 
     */
    const getValue = (mode, param) => {
        switch(mode) {
            case 1:
                return param;
            case 2:
                return program[relativeBase + param] || 0;
            default:
                return program[param] || 0;
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
     * This input is for address only parameters.
     * It returns the parameter in mode 0
     * It returns the relative address in mode 2
     * Throws exception other wise
     * @param {Number} mode 
     * @param {Number} param 
     */
    const getAddress = (mode, param) => {
        switch(mode) {
            case 0:
                return param;
            case 2:
                return relativeBase + param;
            default:
                throw "Invalid mode";
        }
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
                 * ADD {P/N/R} {P/N/R} {P/R} 
                 * Adds the value given by first 2 params and saves
                 * it in the position given by 3rd param.
                 */
                case 1:
                    values = getValues(modes, 2, control + 1);
                    values[2] = getAddress(Math.floor(modes/100) % 10, program[control + 3]);
                    program[values[2]] = values[0] + values[1];
                    control += 4;
                    break;

                /**
                 * MUL {P/N/R} {P/N/R} {P/R}
                 * Multiplies the value given by first 2 params and saves
                 * it in the position given by 3rd param.
                 */
                case 2:
                    values = getValues(modes, 2, control + 1);
                    values[2] = getAddress(Math.floor(modes/100) % 10, program[control + 3]);
                    program[values[2]] = values[0] * values[1];
                    control += 4;
                    break;

                /**
                 * INP {P/R}
                 * Takes in a input and saves it a the position given by 2nd param.
                 */
                case 3:
                    if (inputs && inputs.length) {
                        // console.log("Input received:", inputs[0]);
                        const position = getAddress(modes % 10, program[control + 1]);
                        program[position] = inputs[0];
                        inputs.splice(0, 1);
                        control += 2;
                        break;
                    } else {
                        // console.log("Program waiting for input...");
                        return { done: false, inputRequired: true };
                    }

                /**
                 * OUT {P/N/R}
                 * Returns the value given by 2nd param.
                 */
                case 4:
                    values = getValues(modes, 1, control + 1);
                    control += 2;
                    return { done: false, value: values[0] };

                /**
                 * JNZ {P/N/R} {P/R}
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
                 * JEZ {P/N/R} {P/N/R}
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
                 * LTJ {P/N/R} {P/N/R} {P/R}
                 * Jump to the position given by the 3rd param if the value given by
                 * the first param is lest the value given by the second param.
                 */
                case 7:
                    values = getValues(modes, 2, control + 1);
                    values[2] = getAddress(Math.floor(modes/100) % 10, program[control + 3]);
                    program[values[2]] = (values[0] < values[1]) ? 1 : 0;
                    control += 4;
                    break;

                /**
                 * EQJ {P/N/R} {P/N/R} {P/R}
                 * Jump to the position given by the 3rd param if the value given by
                 * the first and second params are equal.
                 */
                case 8:
                    values = getValues(modes, 2, control + 1);
                    values[2] = getAddress(Math.floor(modes/100) % 10, program[control + 3]);
                    program[values[2]] = (values[0] === values[1]) ? 1 : 0;
                    control += 4;
                    break;

                /**
                 * SET {P/N/R}
                 * Sets the relative address of the system.
                 */
                case 9:
                    values = getValues(modes, 1, control + 1);
                    relativeBase += values[0];
                    control += 2;
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

    /**
     * Resets the system with the given input.
     * @param {Array<Number>} input 
     */
    const reset = (input) => {
        program = input;
        control = 0;
        relativeBase = 0;
    } 

    const getInternals = () => {
        return {
            program: program.slice(0),
            control,
            relativeBase
        }
    }

    const setInternals = (input) => {
        program = input.program.slice(0);
        control = input.control;
        relativeBase = input.relativeBase;
    }

    return {
        exec,
        reset,
        getInternals,
        setInternals
    }
}

module.exports = {
    default: intcode
}