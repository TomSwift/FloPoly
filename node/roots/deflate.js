"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deflateQuad = exports.deflate = void 0;
const double_double_1 = require("double-double");
const qmd = double_double_1.ddMultDouble2;
const qaq = double_double_1.ddAddDd;
/**
 * Deflates the given polynomial approximately by removing a factor (x - r),
 * where r is a root of the polynomial.
 * @param p a polynomial
 * @param root a root of the polynomial.
 * @example
 * // The polynomial x^3 - 5x^2 + 8x - 4 has a root at 1 and a double root at 2
 * deflate([1, -5, 8, -4], 2); //=> [1, -3, 2]
 * deflate([1, -3, 2], 2);     //=> [1,-1]
 * deflate([1, -1], 1);        //=> [1]
 */
function deflate(p, root) {
    let d = p.length - 1;
    let bs = [p[0]];
    for (let i = 1; i < d; i++) {
        bs.push(p[i] + root * bs[i - 1]);
    }
    return bs;
}
exports.deflate = deflate;
function deflateQuad(p, root) {
    let d = p.length - 1;
    let bs = [p[0]];
    for (let i = 1; i < d; i++) {
        bs.push(qaq(p[i], qmd(root, bs[i - 1])));
    }
    return bs;
}
exports.deflateQuad = deflateQuad;
//# sourceMappingURL=deflate.js.map