
//import { twoProduct, twoSum } from "big-float-ts";

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗ Otherwise code is too slow❗
import { operators as bigFloatOperators } from "big-float-ts";
const { twoSum, twoProduct } = bigFloatOperators;


/**
 * Returns an EFT (error free transformation) for the Horner evaluation of a
 * polymial at a specified x.
 * see https://hal.archives-ouvertes.fr/hal-00107222/document
 * (Faithful Polynomial Evaluation with Compensated Horner Algorithm)
 * Philippe Langlois, Nicolas Louvet. Faithful Polynomial Evaluation with Compensated Horner Algorithm. ARITH18: 18th IEEE International Symposium on Computer Arithmetic, Jun 2007, Montpellier, France. pp.141–149. ffhal-00107222f
 */
function EFTHorner(p: number[], x: number) {
	let pπ: number[] = []; // A polynomial containing part of the error
	let pσ: number[] = []; // Another polynomial containing part of the error
	let σ: number;
	
	let r̂ = p[0];
	for (let i=1; i<p.length; i++) {
		let [π,pi] = twoProduct(r̂,x); // TODO - unroll all critical twoProduct and twoSum and fastTwoSums
		[σ,r̂] = twoSum(pi, p[i]);
		// inlined
		//r̂ = pi + p[i]; let bv = r̂ - pi; σ = (pi - (x-bv)) + (p[i]-bv);
		pπ.push(π);
		pσ.push(σ);
	}

	return { r̂, pπ, pσ }
}

// inlined
//let pπ: number[] = []; let pσ: number[] = []; let σ: number; let r̂ = p[0];	for (let i=1; i<p.length; i++) { let [π,pi] = twoProduct(r̂,x); [σ,r̂] = twoSum(pi, p[i]); pπ.push(π); pσ.push(σ); } return { r̂, pπ, pσ }


export { EFTHorner }
