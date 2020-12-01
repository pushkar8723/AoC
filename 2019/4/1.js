function isValidNumber(num) {
    for (let i = 1; i < num.length; i++) {
        if (parseInt(num[i-1]) > parseInt(num[i])) {
            return false;
        }
    }
    const numCount = {};
    for (let i = 1; i < num.length; i++) {
        if (num[i-1] == num[i]) {
            numCount[num[i]] = numCount[num[i]] ? numCount[num[i]] + 1 : 2;
        }
    }
    const repeatedNumbers = Object.keys(numCount);
    for (let i = 0; i < repeatedNumbers.length; i++) {
        // return true; // Uncomment for part one
        if (numCount[repeatedNumbers[i]] === 2) {
            return true;
        }        
    }
    return false;
}

function main() {
    let validNumber = 0;
    for (let i = 359282; i < 820401; i++) {
        if (isValidNumber(i.toString())) {
            validNumber++;
            console.log('DEBUG:', i);
        }
    }
    console.log(validNumber);
}

main();