#include <stdio.h>

void copy(int *a, int *b, int length) {
	int i;
	for (i = 0; i < length; i++) {
		b[i] = a[i];
	}
}

int intcodeExec(int noun, int verb, int *input) {
	int i = 0, address[200];
	copy(input, address, 200);
	address[1] = noun;
	address[2] = verb;
	while(address[i] != 99) {
		int val1 = address[address[i+1]], val2 = address[address[i+2]];
		switch(address[i]) {
			case 1:
				address[address[i+3]] = val1 + val2;
				i += 4;
				break;
			case 2:
				address[address[i+3]] = val1 * val2;
				i += 4;
				break;
			default:
				return -1;
		}
	}
	return address[0];
}

int main() {
	// Variable declaration
	int i, j, output, count = 0, input[200];
	
	// input
	while(scanf("%d,", &input[count++]) != EOF);
	for (i = 0; i <= 99; i++) {
		for (j = 0; j <= 99; j++) {
			printf("Try %d:\n", i*100 + j);
			output = intcodeExec(i, j, input);
			if (output == 19690720) {
				printf("Found it!\n");
				return 0;
			}
		}
	}
	
	return 1;
}
