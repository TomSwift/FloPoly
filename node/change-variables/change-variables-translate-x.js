"use strict";
//import { expansionProduct, fastExpansionSum, scaleExpansion2 } from "big-float-ts";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeVariablesTranslateXExactExp = exports.changeVariablesTranslateXExact = exports.changeVariablesTranslateX = void 0;
// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗ Otherwise code is too slow❗
const big_float_ts_1 = require("big-float-ts");
const { expansionProduct, fastExpansionSum, scaleExpansion2 } = big_float_ts_1.operators;
/**
 * Returns the approximate result of performing a change of variables of the form: p(x) <- p(x + b).
 * See this stackoverflow question http://stackoverflow.com/questions/141422/how-can-a-transform-a-polynomial-to-another-coordinate-system
 * @param p a polynomial
 * @param b
 * @example
 * changeVariablesTranslateX([1,2,7], 3); //=> [1, 8, 22]
 */
function changeVariablesTranslateX(p, b) {
    // We let the coefficients of p(x + b) be denoted by d_i in the code below. 
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
        t[0][j] = b * t[0][j - 1];
        for (let i = 1; i <= j; i++) {
            t[i][j] = b * t[i][j - 1] + t[i - 1][j - 1];
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
exports.changeVariablesTranslateX = changeVariablesTranslateX;
/**
 * Returns the exact result of performing a change of variables of the form: p(x) <- p(x + b).
 * See this stackoverflow question http://stackoverflow.com/questions/141422/how-can-a-transform-a-polynomial-to-another-coordinate-system
 * @param p a polynomial
 * @param b
 */
function changeVariablesTranslateXExact(p, b) {
    // We let the coefficients of p(x + b) be denoted by d_i in the code below. 
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
        t[0][j] = scaleExpansion2(b, t[0][j - 1]);
        for (let i = 1; i <= j; i++) {
            t[i][j] = fastExpansionSum(scaleExpansion2(b, t[i][j - 1]), t[i - 1][j - 1]);
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
exports.changeVariablesTranslateXExact = changeVariablesTranslateXExact;
/**
 * Returns the exact result of performing a change of variables of the form: p(x) <- p(x + b).
 * See this stackoverflow question http://stackoverflow.com/questions/141422/how-can-a-transform-a-polynomial-to-another-coordinate-system
 * @param p a polynomial
 * @param b
 */
function changeVariablesTranslateXExactExp(p, b) {
    // We let the coefficients of p(x + b) be denoted by d_i in the code below. 
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
        t[0][j] = expansionProduct(b, t[0][j - 1]);
        for (let i = 1; i <= j; i++) {
            t[i][j] = fastExpansionSum(expansionProduct(b, t[i][j - 1]), t[i - 1][j - 1]);
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
exports.changeVariablesTranslateXExactExp = changeVariablesTranslateXExactExp;
//# sourceMappingURL=change-variables-translate-x.js.map