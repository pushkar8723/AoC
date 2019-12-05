process.stdin.resume();
process.stdin.setEncoding('utf8');

function createPoint(x, y) {
	return { x, y };
}

function createEdge(a, b) {
	return { a, b };
}

function goUp(distance, from) {
	return {
		...from,
		x: from.x + distance
	};
}

function goDown(distance, from) {
	return {
		...from,
		x: from.x - distance
	};
}

function goRight(distance, from) {
	return {
		...from,
		y: from.y + distance
	};
}

function goLeft(distance, from) {
	return {
		...from,
		y: from.y - distance
	};
}

function intersectionPoint(m, n) {
	const deltaMX = Math.abs(m.a.x - m.b.x);
	const deltaMY = Math.abs(m.a.y - m.b.y);
	const deltaNX = Math.abs(n.a.x - n.b.x);
	const deltaNY = Math.abs(n.a.y - n.b.y);

	if (deltaMX === 0 && deltaNX === 0) {
		// parallel edges
		return;
	} else if (deltaMY === 0 && deltaNY === 0) {
		// parallel edges
		return;
	} else if (
		deltaMX === 0 && deltaNX !== 0 &&
		((m.a.x > n.a.x && m.a.x < n.b.x) || (m.a.x > n.b.x && m.a.x < n.a.x)) &&
		((n.a.y > m.a.y && n.a.y < m.b.y) || (n.a.y > m.b.y && n.a.y < m.a.y))
	) {
		return createPoint(m.a.x, n.a.y);
	} else if (
		deltaNX === 0 && deltaMX !== 0 &&
		((n.a.x > m.a.x && n.a.x < m.b.x) || (n.a.x > m.b.x && n.a.x < m.a.x)) &&
		((m.a.y > n.a.y && m.a.y < n.b.y) || (m.a.y > n.b.y && m.a.y < n.a.y))
	) {
		return createPoint(n.a.x, m.a.y);
	} else {
		return;
	}
}

function isPointOnEdge(p, e) {
	return (
		((p.x >= e.a.x && p.x <= e.b.x) || (p.x >= e.b.x && p.x <= e.a.x)) &&
		((p.y >= e.a.y && p.y <= e.b.y) || (p.y >= e.b.y && p.y <= e.a.y))
	);
}

function distanceBetweenPoints(p1, p2) {
	return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function lengthOfWire(point, edges) {
	let sum = 0;
	for (const edge of edges) {
		if (isPointOnEdge(point, edge)) {
			sum += distanceBetweenPoints(edge.a, point);
			// console.log('DEBUG:', point, edge, sum);
			break;
		} else {
			sum += distanceBetweenPoints(edge.a, edge.b);
			// console.log('DEBUG:', edge, sum);
		}
	}
	return sum;
}

process.stdin.on('data', function (chunk) {
	const lines = chunk.toString().split('\n');
	const redPath = lines[0].split(',');
	const greenPath = lines[1].split(',');
	let lastPoint = createPoint(0, 0);

	const mapPath = (prev, current) => {
		let newPoint;
		switch(current[0]) {
			case 'U':
				newPoint = goUp(parseInt(current.substr(1)), lastPoint);
				prev.push(createEdge(lastPoint, newPoint));
				break;
			case 'D':
				newPoint = goDown(parseInt(current.substr(1)), lastPoint);
				prev.push(createEdge(lastPoint, newPoint));
				break;
			case 'R':
				newPoint = goRight(parseInt(current.substr(1)), lastPoint);
				prev.push(createEdge(lastPoint, newPoint));
				break;
			case 'L':
				newPoint = goLeft(parseInt(current.substr(1)), lastPoint);
				prev.push(createEdge(lastPoint, newPoint));
				break;
		}
		lastPoint = newPoint;
		return prev;
	}

	const redEdges = redPath.reduce(mapPath, []);

	lastPoint = createPoint(0, 0);
	const greenEdges = greenPath.reduce(mapPath, []);

	const points = [];
	redEdges.forEach((edge1) => {
		greenEdges.forEach((edge2) => {
			const ip = intersectionPoint(edge1, edge2);
			if (ip) {
				// console.log('DEBUG:', edge1, edge2, ip);
				points.push(ip);
			}
		});
	})
	points.sort((a, b) => {
		const distA = Math.abs(a.x) + Math.abs(a.y);
		const distB = Math.abs(b.x) + Math.abs(b.y);
		return distA - distB;
	});
	console.log(points[0]);

	// ---- part 2 ---- //
	let min = Infinity;
	for (const point of points) {
		const currDist = lengthOfWire(point, redEdges) + lengthOfWire(point, greenEdges);
		if (currDist < min) {
			min = currDist;
		}
	}
	console.log(min);
});