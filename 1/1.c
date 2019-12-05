#include <stdio.h>

int main() {
    int mass, sum = 0;
    while(scanf("%d", &mass) != EOF) {
        sum += mass / 3 - 2;
    }
    printf("%d", sum);
    return 0;
}
