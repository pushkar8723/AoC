process.stdin.resume();
process.stdin.setEncoding('utf8');

let commonAncestor = null;

function traverse(root, tree, length) {
	let sum = 0;
	if (tree[root]) {
		sum += (length + 1) * tree[root].length;
		tree[root].forEach(node => {
			sum += traverse(node, tree, length + 1);
		});
	}
	return sum;
}

function isCommonAncestor(node1, node2, root, tree) {
	let foundLeft = false, foundRight = false;
	if (root === node1) {
		foundLeft = true;
	}
	if (root === node2) {
		foundRight = true;
	}
	if (tree[root]) {
		tree[root].forEach(child => {
			const result = isCommonAncestor(node1, node2, child, tree);
			foundLeft = foundLeft || result.foundLeft;
			foundRight = foundRight || result.foundRight; 
		});
		if (foundLeft && foundRight && !commonAncestor) {
			commonAncestor = root;
		}
	}
	return {
		foundLeft,
		foundRight
	}
}

function distance(node1, node2, tree) {
	if (node1 === node2) {
		return 0;
	}
	let dist = Infinity;
	if (tree[node1]) {
		tree[node1].forEach(child => {
			dist = Math.min(dist, distance(child, node2, tree) + 1);
		});
	}
	return dist;
}

process.stdin.on('data', function (chunk) {
	const tree = {};
    const lines = chunk.toString().split('\n');
    lines.forEach(line => {
    	const nodes = line.split(')');
    	if (tree[nodes[0]]) {
    		tree[nodes[0]].push(nodes[1])
    	} else {
    		tree[nodes[0]] = [ nodes[1] ];
    	}
    });

    console.log(traverse('COM', tree, 0));
    isCommonAncestor('YOU', 'SAN', 'COM', tree);
    console.log('Common Ancestor:', commonAncestor);
    const distCAtoYou = distance(commonAncestor, 'YOU', tree);
    const distCAtoSan = distance(commonAncestor, 'SAN', tree);
    console.log('Distance CA to You:', distCAtoYou);
    console.log('Distance CA to Santa:', distCAtoSan);
    console.log('Distance:', distCAtoYou - 1 + distCAtoSan - 1);
});