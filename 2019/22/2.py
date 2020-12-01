import sys

totalCards = 119315717514047
times = 101741582076661

def modInv(n):
    return pow(n, totalCards - 2, totalCards)

a = 1
b = 0

for line in sys.stdin:
    if line.strip() == "deal into new stack":
        a *= -1
        a %= totalCards
        b += a
        b %= totalCards
    elif line.startswith("cut"):
        n = int(line.split(" ")[-1])
        b += n * a
        b %= totalCards
    elif line.startswith("deal with increment"):
        n = int(line.split(" ")[-1])
        a *= modInv(n)
        b %= totalCards
    else:
        print("WTF!")

inc = pow(a, times, totalCards)
offset = b * (1 - inc) * modInv((1 - a) % totalCards)
offset %= totalCards

print((offset + 2020 * inc) % totalCards)