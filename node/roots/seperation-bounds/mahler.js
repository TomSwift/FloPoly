"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const degree_1 = require("../../basic/degree");
// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗ Otherwise code is too slow❗
const degree = degree_1.degree;
/**
 * Returns the Mahler seperation bound, i.e. a bound on the minimum complex root
 * seperation of the given polynomial.
 * * precondition: the polynomial is square-free
 * see e.g. https://arxiv.org/pdf/1606.01131.pdf
 * @param p a polynomial
 * @param lowerBound the lower bound of the range within which a root can be
 * @param upperBound the upper bound of the range within which a root can be
 *
 */
function complexMahlerSep(p, lowerBound, upperBound) {
    let d = degree(p);
    let sqrt3 = Math.sqrt(3);
    /** the maximum absolute value of one of the roots */
    let m = Math.max(Math.abs(lowerBound), Math.abs(upperBound));
    let m1 = sqrt3 * Math.pow((d + 1), (-(2 * d + 1) / 2));
    // TODO - finish
    //let m2 = m1 * height(p)**(-d+1);
}
//# sourceMappingURL=mahler.js.map