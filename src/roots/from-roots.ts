
//import { eEstimate, eCompress } from "big-float-ts";
import { multiply as multiply_, multiplyExact as multiplyExact_ } from "../basic/multiply";

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗ Otherwise code is too slow❗
import { operators as bigFloatOperators } from "big-float-ts";
const { eEstimate, eCompress } = bigFloatOperators;
const multiply = multiply_;
const multiplyExact = multiplyExact_;


/**
 * Constructs a polynomial from the given roots by multiplying out the 
 * factors (x - root1)(x - root2)... Note that the resulting polynomial 
 * will not have any complex roots.
 * 
 * Mostly provided for testing purposes. Note that the real roots of the 
 * constructed polynomial may not be exactly the same as the roots that
 * the polynomial has been constructed from due to floating-point 
 * round-off.
 * 
 * @param roots - The roots
 * @example
 * fromRoots([1,2,3,3]); //=> [1, -9, 29, -39, 18]
 * allRoots([1, -9, 29, -39, 18]); //=> [1.0000000000000007, 2.000000000000004]
 * // In the above note the rounding error. Also note the multiple root of 3 that has been missed.
 * allRoots([1, -9, 29, -39, 17.99999999999999]); //=> [0.9999999999999973, 2.00000000000002, 2.9999999999999982]
 * allRoots([1, -9, 29, -39, 17.9999999999999]); //=> [0.999999999999975, 2.0000000000000986, 2.9999997898930832, 3.0000002095475775]
 */
function fromRoots(roots: number[]): number[] {
	let p = [1]; 
	for (let i=0; i<roots.length; i++) {
		p = multiply(p, [1,-roots[i]]);
	}
	
	return p;
}


/**
 * Constructs a polynomial from the given roots by multiplying out the 
 * factors (x - root1)(x - root2)... Note that the resulting polynomial 
 * will not have any complex roots.
 * 
 * Mostly provided for testing purposes.
 * 
 * @param roots the roots
 */
function fromRootsExact(roots: number[]): number[][] {
	let p = [[1]]; 
	for (let i=0; i<roots.length; i++) {
		p = multiplyExact([p, [[1], [-roots[i]]]]);
	}
	
	return p.map(eCompress);
}


export { fromRoots, fromRootsExact }
