const map = new WeakMap();
function point(x, y) {
    this.x = x;
    this.y = y;
    this.toString = () => {
        return `${x},${y}`;
    }
}
const p = (x, y) => new point(x, y);

module.exports = {
    map,
    p
};
