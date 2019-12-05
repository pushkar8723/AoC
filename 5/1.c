#include <stdio.h>

int getValue(int *input, int mode, int param) {
    if (mode == 1) {
        return param;
    }
    return input[param];
}

void getValues(int code, int *address, int count, int start, int *output) {
    int i, mode;
    for (i = 0; i < count; i++) {
        mode = code % 10;
        code /= 10;
        output[i] = getValue(address, mode, address[start + i]);
        // printf("DEBUG: Value %d: %d\n", i + 1, output[i]);
    }
}

void intcodeExec(int *address, int length) {
    int i = 0, opcode, modes, values[2];
    while(address[i] != 99) {
        opcode = address[i] % 100;
        modes = address[i] / 100;
        // printf("DEBUG: Opcode: %d, Mode: %d\n", opcode, modes);
        switch(opcode) {
            case 1:
                getValues(modes, address, 2, i + 1, values);
                address[address[i+3]] = values[0] + values[1];
                i += 4;
                break;
            case 2:
                getValues(modes, address, 2, i + 1, values);
                address[address[i+3]] = values[0] * values[1];
                i += 4;
                break;
            case 3:
                printf("Input: 5\n");
                // scanf("%d\n", &address[address[i + 1]]);
                address[address[i + 1]] = 5;
                i += 2;
                break;
            case 4:
                getValues(modes, address, 1, i + 1, values);
                printf("Output: %d\n", values[0]);
                i += 2;
                break;
            case 5:
                getValues(modes, address, 2, i + 1, values);
                if (values[0] != 0) {
                    i = values[1];
                } else {
                    i += 3;
                }
                break;
            case 6:
                getValues(modes, address, 2, i + 1, values);
                if (values[0] == 0) {
                    i = values[1];
                } else {
                    i += 3;
                }
                break;
            case 7:
                getValues(modes, address, 2, i + 1, values);
                address[address[i + 3]] = (values[0] < values[1]) ? 1 : 0;
                i += 4;
                break;
            case 8:
                getValues(modes, address, 2, i + 1, values);
                address[address[i + 3]] = (values[0] == values[1]) ? 1 : 0;
                i += 4;
                break;
            default:
                return;
        }
    }
    return;
}

int main() {
    int input[2000], length = 0;
    while (scanf("%d,", &input[length++]) != EOF);
    intcodeExec(input, length);
    return 0;
}