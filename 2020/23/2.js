process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const input = chunk.toString().split('\n')[0].split('').map(i => parseInt(i));
    // Write your code here
    const cups = new Map();
    let last = null;
    
    for (let i = 1000000; i >= 10; i--) {
        const node = {
            val: i,
            next: last,
        };
        cups.set(i, node);
        last = node;
    }
    
    for (let i = input.length - 1; i >= 0; i--) {
        const node = {
            val: input[i],
            next: last,
        };
        cups.set(input[i], node);
        last = node;
    }

    cups.get(1000000).next = last;

    const print = (start, n) => {
        const vals = [];
        let head = start;
        let i = 0;
        do {
            vals.push(head.val);
            head = head.next;
            i++;
        } while(head !== start && i < n);
        return vals.join(',');
    }

    // console.log(print(cups.get(input[0]), 20));
    // console.log(print(cups.get(999990), 20));

    let curr = cups.get(input[0]);
    for (let i = 1; i <= 10000000; i++) {
        const pick = curr.next;
        const currVal = curr.val;
        curr.next = pick.next.next.next;
        const pickValues = new Set([pick.val, pick.next.val, pick.next.next.val]);
        let find = currVal > 1 ? currVal - 1 : 1000000;
        while (pickValues.has(find)) {
            find--;
            if (find <= 0) {
                find = 1000000;
            }
        }
        const destination = cups.get(find);
        const save = destination.next;
        destination.next = pick;
        pick.next.next.next = save;
        curr = curr.next;
    }

    const node1 = cups.get(1);
    // console.log(print(node1));
    console.log(node1.next.val * node1.next.next.val);
});
