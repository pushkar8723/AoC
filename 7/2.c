#include <stdio.h>
#include <string.h>
#include <stdlib.h>

char phases[120][6];
int phaseNum = 0;

int getValue(long long int *input, int mode, int param) {
    if (mode == 1) {
        return param;
    }
    return input[param];
}

void getValues(int code, long long int *address, int count, int start, long long int *output) {
    int i, mode;
    for (i = 0; i < count; i++) {
        mode = code % 10;
        code /= 10;
        output[i] = getValue(address, mode, address[start + i]);
        // printf("DEBUG: Value %d: %d\n", i + 1, output[i]);
    }
}

int intcodeExec(long long int *address, int length, int phase, long long int input, int *curr) {
    int opcode, modes, i = *curr;
    long long int values[2];
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
                // printf("Input: %d\n", phase);
                // scanf("%ld\n", &address[address[i + 1]]);
                address[address[i + 1]] = phase;
                phase = input;
                i += 2;
                break;
            case 4:
                getValues(modes, address, 1, i + 1, values);
                // printf("Output: %d\n", values[0]);
                i += 2;
                *curr = i; 
                return values[0];
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
                exit(-1);
        }
    }
    *curr = i;
    return -1;
}

void copy(long long int *src, long long int *dest, int length) {
    for (int i = 0; i < length; i++) {
        dest[i] = src[i];
    }
}

void permute(char *a, int l, int r) {
    char temp;
    // Base case  
    if (l == r) {
        strcpy(phases[phaseNum++], a);
    } else {  
        // Permutations made  
        for (int i = l; i <= r; i++) {
            // Swapping done  
            // swap(a[l], a[i]); 
            temp = a[l];
            a[l] = a[i];
            a[i] = temp;
  
            // Recursion called  
            permute(a, l+1, r);  
  
            //backtrack  
            // swap(a[l], a[i]); 
            temp = a[l];
            a[l] = a[i];
            a[i] = temp;
        }  
    }  
}

int runPhase(long long int *input, int length, char *phase) {
    int i, ampCtrl[5] = { 0, 0, 0, 0, 0 };
    long long int nextInput = 0;
    long long int currentAmp[5][1000];
    copy(input, currentAmp[0], length);
    copy(input, currentAmp[1], length);
    copy(input, currentAmp[2], length);
    copy(input, currentAmp[3], length);
    copy(input, currentAmp[4], length);
    for (i = 0; i < 5; i++) {
        nextInput = intcodeExec(currentAmp[i], length, phase[i] - '0', nextInput, &ampCtrl[i]);
    }
    while(1) {
        long long int intermOpt = nextInput, sdf;
        for (i = 0; i < 5; i++) {
            sdf = intcodeExec(currentAmp[i], length, intermOpt, intermOpt, &ampCtrl[i]);
            if (sdf != -1) {
                intermOpt = sdf;
            } else {
                return nextInput;
            }
        }
        nextInput = intermOpt;
    }
    return nextInput;
};

int main() {
    long long int input[1000];
    int length = 0, max = 0;
    long long int output;
    while(scanf("%lld,", &input[length++]) != EOF);
    char p[6] = "56789";
    permute(p, 0, 4);
    for (int i = 0; i < phaseNum; i++) {
        output = runPhase(input, length, phases[i]);
        printf("DEBUG PHASE: %s %lld\n", phases[i], output);
        if (max < output)
            max = output;
    }
    printf("%d\n", max);
    return 0;
}