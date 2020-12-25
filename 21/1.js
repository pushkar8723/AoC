process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    const lines = chunk.toString().split('\n').filter(item => item);
    // Write your code here
    const allergens = new Map();
    let allIngredients = [];
    lines.forEach(line => {
        const ingredients = line.split(' (contains')[0].split(' ').filter(i => i);
        const contains = line.split(' (contains')[1].slice(0, -1).split(/,|\s/).filter(i => i);
        // console.log(ingredients, allergens);ß
        contains.forEach(content => {
            if (allergens.has(content)) {
                const set1 = allergens.get(content);
                const possible = set1.filter(item => ingredients.includes(item));
                allergens.set(content, possible);
            } else {
                allergens.set(content, ingredients);
            }
        });
        allIngredients = allIngredients.concat(ingredients);
    });
    const finalMap = new Map();
    const bad = new Set();
    while (finalMap.size !== allergens.size) {
        for (let content of allergens.keys()) {
            if (allergens.get(content).length === 1 && !finalMap.has(content)) {
                const remove = allergens.get(content)[0];
                for (let key of allergens.keys()) {
                    allergens.set(key, allergens.get(key).filter(i => i !== remove));
                }
                finalMap.set(content, remove);
                bad.add(remove);
            }
        }
    }
    console.log(allIngredients.filter(i => !bad.has(i)).length);
    // console.log(finalMap);
    const canonical = [...finalMap.keys()].sort();
    console.log(canonical.map(i => finalMap.get(i)).join(','));
});
