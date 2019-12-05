#include <stdio.h>

int main() {
    int mass, fuel, sum = 0;
    while (scanf("%d", &mass) != EOF) {
        fuel = mass / 3 - 2;
        sum += fuel;
        while(fuel > 0) {
            fuel = fuel / 3 - 2;
            sum += fuel > 0 ? fuel : 0;
        }
    }
    printf("%d", sum);
    return 0;
}
