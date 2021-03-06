"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.p1Norm = void 0;
/**
 * Returns the p-1 norm, a.k.a. the Taxicab norm, i.e. the sum of the absolute
 * values of the given array of numbers.
 */
function p1Norm(p) {
    let sum = 0;
    for (let i = 0; i < p.length; i++) {
        sum += Math.abs(p[i]);
    }
    return sum;
}
exports.p1Norm = p1Norm;
//# sourceMappingURL=p-1-norm.js.map