"use strict";
//import { expansionProduct, fastExpansionSum, scaleExpansion2 } from "big-float-ts";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeVariablesDilateExact = exports.changeVariablesDilateExactExp = exports.changeVariablesDilate = void 0;
// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗ Otherwise code is too slow❗
const big_float_ts_1 = require("big-float-ts");
const { expansionProduct, fastExpansionSum, scaleExpansion2 } = big_float_ts_1.operators;
/**
 * Returns the approximate result of performing a change of variables of the form: p(x) <- p(ax).
 * See this stackoverflow question http://stackoverflow.com/questions/141422/how-can-a-transform-a-polynomial-to-another-coordinate-system
 * @param p a polynomial
 * @param a
 * @example
 * changeVariablesDilate([1,2,7], 3); //=> [9, 6, 7]
 */
function changeVariablesDilate(p, a) {
    // We let the coefficients of p(ax) be denoted by d_i in the code below. 
    // d_i is calculated as d = T*c, where c are the original coefficients.
    let d = p.length - 1;
    // Initialize a zero matrix
    let t = [];
    for (let i = 0; i < d + 1; i++) {
        t.push(new Array(d + 1).fill(0));
    }
    // Calculate the triangular matrix T
    t[0][0] = 1;
    for (let j = 1; j <= d; j++) {
        t[0][j] = 0;
        for (let i = 1; i <= j; i++) {
            t[i][j] = a * t[i - 1][j - 1];
        }
    }
    // Multiply
    let res = new Array(d + 1).fill(0);
    for (let i = 0; i <= d; i++) {
        res[d - i] = 0;
        for (let j = i; j <= d; j++) {
            let acc = t[i][j] * p[d - j];
            res[d - i] += acc;
        }
    }
    return res;
}
exports.changeVariablesDilate = changeVariablesDilate;
/**
 * Returns the exact result of performing a change of variables of the form: p(x) <- p(ax).
 * See this stackoverflow question http://stackoverflow.com/questions/141422/how-can-a-transform-a-polynomial-to-another-coordinate-system
 * @param p a polynomial
 * @param a
 * @example
 * changeVariables([[1],[2],[7]], [3]); //=> [[9], [6], [7]]
 */
function changeVariablesDilateExactExp(p, a) {
    // We let the coefficients of p(ax + b) be denoted by d_i in the code below. 
    // d_i is calculated as d = T*c, where c are the original coefficients.
    let d = p.length - 1;
    // Initialize a zero matrix
    let t = [];
    for (let i = 0; i < d + 1; i++) {
        t.push(new Array(d + 1).fill([0]));
    }
    // Calculate the triangular matrix T
    t[0][0] = [1];
    for (let j = 1; j <= d; j++) {
        t[0][j] = [0];
        for (let i = 1; i <= j; i++) {
            t[i][j] = expansionProduct(a, t[i - 1][j - 1]);
        }
    }
    // Multiply
    let res = new Array(d + 1).fill([0]);
    for (let i = 0; i <= d; i++) {
        res[d - i] = [0];
        for (let j = i; j <= d; j++) {
            let acc = expansionProduct(t[i][j], p[d - j]);
            res[d - i] = fastExpansionSum(res[d - i], acc);
        }
    }
    return res;
}
exports.changeVariablesDilateExactExp = changeVariablesDilateExactExp;
/**
 * Returns the exact result of performing a change of variables of the form: p(x) <- p(ax).
 * See this stackoverflow question http://stackoverflow.com/questions/141422/how-can-a-transform-a-polynomial-to-another-coordinate-system
 * @param p a polynomial
 * @param a
 * @example
 * changeVariables([[1],[2],[7]], 3); //=> [[9], [6], [7]]
 */
function changeVariablesDilateExact(p, a) {
    // We let the coefficients of p(ax + b) be denoted by d_i in the code below. 
    // d_i is calculated as d = T*c, where c are the original coefficients.
    let d = p.length - 1;
    // Initialize a zero matrix
    let t = [];
    for (let i = 0; i < d + 1; i++) {
        t.push(new Array(d + 1).fill([0]));
    }
    // Calculate the triangular matrix T
    t[0][0] = [1];
    for (let j = 1; j <= d; j++) {
        t[0][j] = [0];
        for (let i = 1; i <= j; i++) {
            t[i][j] = scaleExpansion2(a, t[i - 1][j - 1]);
        }
    }
    // Multiply
    let res = new Array(d + 1).fill([0]);
    for (let i = 0; i <= d; i++) {
        res[d - i] = [0];
        for (let j = i; j <= d; j++) {
            let acc = expansionProduct(t[i][j], p[d - j]);
            res[d - i] = fastExpansionSum(res[d - i], acc);
        }
    }
    return res;
}
exports.changeVariablesDilateExact = changeVariablesDilateExact;
//# sourceMappingURL=change-variables-dilate.js.map