"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subtractExact = exports.subtract = void 0;
const remove_leading_zeros_1 = require("./remove-leading-zeros");
//import { eDiff } from "big-float-ts";
// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗ Otherwise code is too slow❗
const big_float_ts_1 = require("big-float-ts");
const { eDiff } = big_float_ts_1.operators;
const removeLeadingZeros = remove_leading_zeros_1.removeLeadingZeros;
const expRemoveLeadingZeros = remove_leading_zeros_1.expRemoveLeadingZeros;
/**
 * Returns an approximate result of subtracting the second polynomial from first (p1 - p2).
 * @param p1 the polynomial from which will be subtracted
 * @param p2 the polynomial that will be subtracted
 * @example
 * subtract([2,3],[4,4]); //=> [-2, -1]
 */
function subtract(p1, p2) {
    // Initialize result array  
    let d1 = p1.length - 1;
    let d2 = p2.length - 1;
    let Δd = d1 - d2;
    let Δd1 = 0;
    let Δd2 = 0;
    if (Δd > 0) {
        Δd2 = -Δd;
    }
    else if (Δd < 0) {
        Δd1 = +Δd;
    }
    let d = Math.max(d1, d2);
    // Add coefficients
    let result = [];
    for (let i = 0; i < d + 1; i++) {
        let c1 = p1[i + Δd1] || 0;
        let c2 = p2[i + Δd2] || 0;
        result.push(c1 - c2);
    }
    // Ensure the result is a valid polynomial representation
    return removeLeadingZeros(result);
}
exports.subtract = subtract;
/**
 * Returns the exact result of subtracting the second polynomial from first (p1 - p2).
 * @param p1 the polynomial from which will be subtracted
 * @param p2 the polynomial that will be subtracted
 * @example
 * subtract([[2],[3]],[[4],[4]]); //=> [[-2], [-1]]
 */
function subtractExact(p1, p2) {
    // Initialize result array  
    let d1 = p1.length - 1;
    let d2 = p2.length - 1;
    let Δd = d1 - d2;
    let Δd1 = 0;
    let Δd2 = 0;
    if (Δd > 0) {
        Δd2 = -Δd;
    }
    else if (Δd < 0) {
        Δd1 = +Δd;
    }
    let d = Math.max(d1, d2);
    // Add coefficients
    let result = [];
    for (let i = 0; i < d + 1; i++) {
        let c1 = p1[i + Δd1] || [0];
        let c2 = p2[i + Δd2] || [0];
        result.push(eDiff(c1, c2));
    }
    // Ensure the result is a valid polynomial representation
    return expRemoveLeadingZeros(result);
}
exports.subtractExact = subtractExact;
//# sourceMappingURL=subtract.js.map