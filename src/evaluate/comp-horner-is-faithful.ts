
import { EFTHorner } from "./eft-horner";
import { HornerSum } from "./horner-sum";
import { HornerAbsSum } from "./horner-abs-sum";
import { twoSum } from "flo-numerical";
import { γs } from "./gammas";


let u = Number.EPSILON;


/**
 * Returns the result of evaluating a univariate polynomial using once compensated
 * Horner's method, including a dynamic check for faithfull rounding and a 
 * certified running error bound.
 * 
 * @param p a polynomial
 * @param x the value at which to evaluate the polynomial
 */
function compHornerIsFaithful(p: number[], x: number) {
	let n = p.length-1;
	
	let { r̂, pπ, pσ } = EFTHorner(p,x);
	let ĉ = HornerSum(pπ, pσ, x);
	let [e, r̄] = twoSum(r̂, ĉ);

	let b̂ = HornerAbsSum(pπ, pσ, Math.abs(x));
	let α̂  = (γs[2*n - 1] * b̂) / ((1 - 2*(n+1) * u));
	let β̂  = (α̂ + Math.abs(e)) / (1 - 2*u);

	return { 
		isFaithful: α̂  < (u/2) * Math.abs(r̄),
		errBound: β̂,
		r̄
	};
}


export { compHornerIsFaithful }
