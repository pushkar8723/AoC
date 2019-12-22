function addmod(x, y, n) {
    if (x + y <= x) x = x - (n - y) % n;
    else x = (x + y) % n;
    return x;
}

function sqrmod(a, n) {
    var b;
    var sum = 0;
    a = a % n;
    for (b = a; b != 0; b >>= 1) {
        if (b & 1) {
            sum = addmod(sum, a, n);
        }
        a = addmod(a, a, n);
    }
    return sum;
}

function powmod(base, exp, mod) {
    var r;
    if(exp === 0) {
        return 1;
    } else if (exp % 2 === 0) {
        r = powmod(base, exp/2, mod) % mod ;
        return sqrmod(r, mod);
    } else {
        return (base * powmod(base, exp - 1, mod)) % mod;
    }
}

module.exports = {
    powmod
}