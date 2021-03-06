"use strict";
//import { eSign } from "big-float-ts";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expSignChanges = exports.signChanges = void 0;
// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗ Otherwise code is too slow❗
const big_float_ts_1 = require("big-float-ts");
const { eSign } = big_float_ts_1.operators;
/**
 * Returns the number of sign changes in the polynomial coefficents
 * when ordered in descending order; zeros are ignored.
 *
 * Descartes' rule of signs states (quoted from Wikipedia):
 * "if the terms of a polynomial are ordered by descending variable
 * exponent, then the number of positive roots of the polynomial is
 * either equal to the number of sign differences between consecutive
 * nonzero coefficients, or is less than it by an even number. Multiple
 * roots of the same value are counted separately."
 *
 * See https://en.wikipedia.org/wiki/Descartes%27_rule_of_signs
 * @param p a polynomial
 * @example
 * signChanges([1,2,-3,0,0,3,-1]); //=> 3
 */
function signChanges(p) {
    let d = p.length - 1;
    let result = 0;
    let prevSign = Math.sign(p[0]);
    for (let i = 1; i < d + 1; i++) {
        let sign = Math.sign(p[i]);
        if (sign !== prevSign && sign !== 0) {
            result++;
            prevSign = sign;
        }
    }
    return result;
}
exports.signChanges = signChanges;
/**
 * Returns the number of sign changes in the polynomial coefficents
 * when ordered in descending order; zeros are ignored.
 *
 * Descartes' rule of signs states (quoted from Wikipedia):
 * "if the terms of a polynomial are ordered by descending variable
 * exponent, then the number of positive roots of the polynomial is
 * either equal to the number of sign differences between consecutive
 * nonzero coefficients, or is less than it by an even number. Multiple
 * roots of the same value are counted separately."
 *
 * See https://en.wikipedia.org/wiki/Descartes%27_rule_of_signs
 * @param p a polynomial
 * @example
 * signChanges([[1],[2],[-3],[0],[0],[3],[-1]]); //=> 3
 */
function expSignChanges(p) {
    let d = p.length - 1;
    let result = 0;
    let prevSign = Math.sign(eSign(p[0]));
    for (let i = 1; i < d + 1; i++) {
        let sign_ = Math.sign(eSign(p[i]));
        if (sign_ !== prevSign && sign_ !== 0) {
            result++;
            prevSign = sign_;
        }
    }
    return result;
}
exports.expSignChanges = expSignChanges;
//# sourceMappingURL=sign-changes.js.map