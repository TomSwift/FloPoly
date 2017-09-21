'use strict'

let coreOperators = require('./core-operators.js');
let rootOperators = require('./root-operators.js');
let rootBounds    = require('./root-bounds.js');

let { brent, quadraticRoots, /*cubicRoots,*/ } = rootOperators;
let { clip0, evaluate, differentiate, toCasStr, } = coreOperators;
let { 
	rootMagnitudeUpperBound_fujiwara,
	positiveRootUpperBound_LMQ,
	positiveRootLowerBound_LMQ,
	negativeRootUpperBound_LMQ,
	negativeRootLowerBound_LMQ,
} = rootBounds;

	  
const INF = Number.POSITIVE_INFINITY;


/**
 * <p>Finds a near optimal approximation to the real roots (or those 
 * within a range) of the input polynomial.
 * </p>
 * <p>
 * Only multiple roots of even order that is very close together may be 
 * missed. (This is rarely a problem in practice - in a geometrical 
 * application, for instance, this may mean two objects are barely 
 * touching and returning either, all, or none of the repeated even 
 * roots should not break the algorithm). 
 * </p>
 * 
 * @alias allRoots
 * @param {number[]} p - The polynomial
 * @param {number} a - Lower limit of root values that should be 
 * returned - defaults to -∞
 * @param {number} b - Upper limit of root values that should be 
 * returned - defaults to +∞
 * @returns {number[]} The found roots.
 * @impl_notes
 * @example
 * FloPoly.allRoots([1, -10, 35, -50, 24]); //=> [1, 2.0000000000000036, 3.0000000000000067, 4] 
 */
function allRootsRecursive(p, a, b) {
	p = clip0(p);
	a = a === undefined ? -INF : a;
	b = b === undefined ? +INF : b;
	
	let d = p.length-1;
	let rangeFilter = inRange(a,b);
	
	if (d === 2) {
		return quadraticRoots(p)
		.filter(rangeFilter);
	// Investigate if any numerically stable algorithm could be as fast
	// as this algorithm (i.e by finding cubic roots within quadratic
	// root demarcated intervals via Brent's method. The cubicRoots 
	// algoritm below has been removed since it was numerically 
	// unstable.
	/*} else if (d === 3) {
		return cubicRoots(p)
			.filter(rangeFilter)
			.sort((a,b) => a-b)
	} else if (d > 3) {*/
	} else if (d > 2) {
		// TODO The root bounding function below might have an impact on 
		// performance - it would probably be better to use 
		// positiveRootUpperBound_LMQ or (possibly) even better, the 
		// linear version of it (see paper of Viglas, Akritas and 
		// Strzebonski) and re-calculate bounds on every iteration.
		let lowerBound;
		let upperBound;
		if (a === -INF || b === +INF) {
			//let magnitudeBound = rootMagnitudeUpperBound_fujiwara(p);
			//lowerBound = a === -INF ? -magnitudeBound : a;
			//upperBound = b === +INF ? +magnitudeBound : b;
			
			lowerBound = a === -INF 
				? negativeRootLowerBound_LMQ(p) 
				: a;
			upperBound = b === +INF 
				? positiveRootUpperBound_LMQ(p) 
				: b;
		} else {
			lowerBound = a;
			upperBound = b;
		}
		
		// If the roots of differentiated polynomial is out of range 
		// then the roots of the polynomial itself will also be out of 
		// range.
		let dp = differentiate(p);
		let roots = allRootsRecursive(dp, lowerBound, upperBound)
			.filter(rangeFilter);
		
		if (roots[0] !== lowerBound) {
			roots.unshift(lowerBound); // Not really a root.
		}
		if (roots[roots.length-1] !== upperBound) {
			roots.push(upperBound);    // Not really a root.
		}
		return rootsWithin(p, roots);	
	} else if (d === 1) {
		// Less likely so put near bottom (micro optimization)
		return [-p[1]/p[0]]
		.filter(rangeFilter);
	} else if (d === 0) {
		return []; // y = c -> no roots	
	}

	// Least likely so put at bottom (micro optimization)
	// d === -1
	// y = 0 -> infinite number of roots
	return [];  
}


/**
 * Returns a function that returns true if x is in the range [a,b].
 *  
 * @ignore
 * @param {number} a
 * @param {number} b
 * @returns {function}
 */
function inRange(a, b) {
	return function(x) {
		return x >= a && x <= b;	
	}
}


/**
 * Finds all roots of the given polynomial within the given intervals.
 *  
 * @ignore
 * @param {number[]} p
 * @param {number[]} intervals
 * @returns {number[]} The found roots.
 */
function rootsWithin(p, intervals) {

	let roots = [];
	let peval = evaluate(p);
	
	let prevRoot;
	let a = intervals[0];
	for (let i=1; i<intervals.length; i++) {
		let root; 
		let b = intervals[i];
		
		let evA = peval(a);
		let evB = peval(b);
		
		let k = evA*evB;
		
		if (k === 0) {
			if (evA === 0) {
				root = a;
			} else if (evB === 0 && i === intervals.length-1) {
				root = b;
			}
		} else if (evA*evB < 0) {
			root = brent(peval, a, b);
		}
		
		// Add root if it exists and suppress exact duplicates
		if (root !== undefined && root !== prevRoot) {  
			roots.push(root);
			prevRoot = root;
		}
		
		a = b;
	}
	
	return roots;	
}


module.exports = allRootsRecursive;
