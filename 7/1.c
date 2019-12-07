#include <stdio.h>
#include <string.h>

char phases[120][6];
int phaseNum = 0;
char feedbackPhases[120][6];

int getValue(long long int *input, int mode, int param) {
    if (mode == 1) {
        return param;
    }
    return input[param];
}

void getValues(int code, long long int *address, int count, int start, int *output) {
    int i, mode;
    for (i = 0; i < count; i++) {
        mode = code % 10;
        code /= 10;
        output[i] = getValue(address, mode, address[start + i]);
        // printf("DEBUG: Value %d: %d\n", i + 1, output[i]);
    }
}

int intcodeExec(long long int *address, int length, int phase, long long int input) {
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
                // printf("Input: %d\n", phase);
                // scanf("%ld\n", &address[address[i + 1]]);
                address[address[i + 1]] = phase;
                phase = input;
                i += 2;
                break;
            case 4:
                getValues(modes, address, 1, i + 1, values);
                // printf("Output: %d\n", values[0]);
                return values[0];
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
                return -1;
        }
    }
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

int amp(long long int *input, int length, int phase, long long int inp) {
    long long int current[1000];
    copy(input, current, length);
    return intcodeExec(input, length, phase, inp);
}

int runPhase(long long int *input, int length, char *phase) {
    int i;
    long long int nextInput = 0;
    long long int currentAmp[5][1000];
    copy(input, currentAmp[0], length);
    copy(input, currentAmp[1], length);
    copy(input, currentAmp[2], length);
    copy(input, currentAmp[3], length);
    copy(input, currentAmp[4], length);
    for (i = 0; i < 5; i++) {
        nextInput = intcodeExec(currentAmp[i], length, phase[i] - '0', nextInput);
    }
    return nextInput;
};

int main() {
    long long int input[1000];
    int length = 0, max = 0;
    long long int output;
    char p[6] = "01234";
    char fp[6] = "56789";
    for(int i = 0; i < phaseNum; i++) {
        printf("%s\n", phases[i]);
        printf("%s\n", feedbackPhases[i]);
    }
    while(scanf("%lld,", &input[length++]) != EOF);
    permute(p, 0, 4);
    // permuteF(fp, 0, 4);
    for (int i = 0; i < phaseNum; i++) {
        // for (int j = 0; j < phaseNum; j++) {
            output = runPhase(input, length, phases[i]);
            printf("%s %lld\n", phases[i], output);
            if (max < output) 
                max = output;
        // }
    }
    printf("%d\n", max);
    return 0;
}