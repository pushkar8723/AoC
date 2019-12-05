#include <stdio.h>
int main() {
    // Variable declaration
    int i, n, count = 0, address[200];
    
    // input
    while(scanf("%d,", &address[count++]) != EOF);
    address[1] = 12;
    address[2] = 2;
    
    // checking proper initial state
    for(i = 0; i < count; i++) {
        printf("%d ", address[i]);
    }

    // program
    i = 0;
    while(address[i] != 99) {
        int val1 = address[address[i+1]], val2 = address[address[i+2]];
        if (address[i] == 1) {
            address[address[i+3]] = val1 + val2;
        } else if (address[i] == 2) {
            address[address[i+3]] = val1 * val2;
        } else {
            // error state
            return 1;
        }
        i += 4;
    }

    // output
    printf("\nAnswer: %d\n", address[0]);

    // check again
    for (i = 0; i < count; i++) {
        printf("%d ", address[i]);
    }
    return 0;
}
