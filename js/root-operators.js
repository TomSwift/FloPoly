'use strict'

let coreOperators = require('./core-operators.js');

/**
 * Operators (i.e. functions) directly related to roots and root 
 * finding. 
 * 
 * @ignore
 */
let rootOperators = {
		quadraticRoots,
		//cubicRoots,
		numRootsWithin,
		brent,
		//coreOperators,
};


let { sturmChain, evaluate, signChanges } = coreOperators;


/**
 * Floating-point-stably calculates and returns the ordered quadratic 
 * roots of the given quadratic polynomial.
 * 
 * @param {number[]} p - The 2nd order polynomial
 * @returns {number[]} The found quadratic roots.
 * @example 
 * FloPoly.quadraticRoots([1, -3, 2]); //=> [1,2]
 */
function quadraticRoots(p) {
	let [a,b,c] = p;
	
	let delta = b*b - 4*a*c;
	
	if (delta < 0) {
		// No real roots;
		return []; 
	}
	
	if (delta === 0) {
		return [-b / (2*a)];
	}
	
	delta = Math.sqrt(delta);
	
	let root1;
	let root2;
	if (b >= 0) {
		root1 = (-b - delta) / (2*a);
		root2 = (2*c) / (-b - delta);
	} else {
		root1 = (2*c) / (-b + delta);
		root2 = (-b + delta) / (2*a);
	}
	
	if (root1 < root2) { 
		return [root1, root2];	
	}
	return [root2, root1];
}


/**
 * Calculates the roots of the given cubic polynomial.
 * 
 * This code is mostly from the Pomax guide found at
 * https://pomax.github.io/bezierinfo/#extremities
 * 
 * @param {number[]} p - A cubic polynomial.
 * @returns {number[]} 1,2 or 3 roots.
 */
// TODO - This function as it currently stands is very sensitive to
// the first coefficient if it is very small, e.g. compare:
// cubicRoots([1e-5, 1560,-1740,96]) = [1.1903631761670113, -156000001.1153846, -0.07497859001159668] 
// vs
// quadraticRoots([1560,-1740,96]) = [0.05821032751613551, 1.0571742878684798]
// It is completely useless in some ranges of its input domain:
// the part of the function 'if (discriminant < 0) {}'
// is highly problematic for numerical stability.
// Simply use allRoots / allRootsRecursive instead.
/*
function cubicRoots(p) {

	function cuberoot(v) {
		return v < 0 
			? -Math.pow(-v, 1/3)
		    : +Math.pow(v, 1/3);
	}
	
	let cbrt = Math.cbrt || cuberoot;
	
	let d = p[0];
	let a = p[1] / d;
	let b = p[2] / d;
	let c = p[3] / d;
	
	let s  = (3*b - a*a) / 9;
	let q  = (2*a*a*a - 9*a*b + 27*c) / 54;
	
	let s3 = s*s*s;
	let q2 = q*q;
	
	let discriminant = q2 + s3;

	if (!Number.isFinite(discriminant)) {
		
		// Overflow occured - in which case one root will be very large. 
		// We might want to report such large roots as positive or
		// negative infinity but since they are rarely of interest we
		// report only the smaller roots.
		
		// Here q*q   === (729*c^2 - 486*a*b*c + 108*a^3*c + 81*a^2*b^2 - 36*a^4*b + 4*a^6) / (729*4)
		// and  s*s*s === (27*b^3 - 27*a^2*b^2 + 9*a^4*b - a^6) / (729*1)
		
		return quadraticRoots(p.slice(1)); 
	}
	
	if (discriminant < 0) {
		// three real roots
		
		let r = Math.sqrt(-s3);
		let t = -q / r;
		
		let cosphi = t < -1 ? -1 : t > 1 ? 1 : t;
		let phi    = Math.acos(cosphi);
		let	t1     = 2*cbrt(r);
		
		let ao3 = a/3; 
		
		return [
			t1*Math.cos((phi            )/3) - ao3, 
			t1*Math.cos((phi + 2*Math.PI)/3) - ao3, 
			t1*Math.cos((phi + 4*Math.PI)/3) - ao3
		]
	} else if (discriminant === 0) {
		// three real roots, but two of them are equal
		
		let u1 = q < 0 ? cbrt(-q) : -cbrt(q);
		let ao3 = a/3;
		
		return [
			2*u1 - ao3, 
			-u1 - ao3
		];
	} else {
		// one real root, two complex roots
		
		let sd = Math.sqrt(discriminant);
		let u1 = cbrt(sd - q);
		let v1 = cbrt(sd + q);
		
		return [u1 - v1 - a/3];
	}
}
*/


/** 
 * Returns the number of real roots in the interval (a,b) of the given 
 * polynomial.
 * 
 * @param {number[]} p - The polynomial
 * @param {number} a - The lower bound
 * @param {number} b - The upper bound
 * @returns {number} The number of roots in the given interval
 * @example 
 * let p = [1, 1, -64, 236, -240];
 * FloPoly.numRootsWithin(p,-20,-11); //=> 0
 * FloPoly.numRootsWithin(p,-11,-9);  //=> 1  
 * FloPoly.numRootsWithin(p,-11,3.5); //=> 3
 * FloPoly.numRootsWithin(p,-11,5);   //=> 4
 */ 
function numRootsWithin(p, a, b) {
	let ps = sturmChain(p);
	let ev = evaluate(p);
	let as = ps.map(p => evaluate(p)(a));
	let bs = ps.map(p => evaluate(p)(b));
	
	return signChanges(as) - signChanges(bs);
}


/**
 * <p>
 * Searches an interval (a,b) for a root (i.e. zero) of the 
 * given function with respect to its first argument using the Brent's 
 * Method root-finding algorithm. Any function can be supplied (it does
 * not even have to be continuous) as long as the root is bracketed. 
 * </p>
 * <p>
 * Brent's Method is an excellent root-finding choice since it is
 * (1) guaranteed to converge (unlike the Newton and other so-called 
 * single-point methods), (2) converges in a reasonable number of 
 * iterations even for highly contrived functions (unlike Dekker's 
 * Method) and (3) nearly always converges extremely fast, i.e. super-
 * linearly (unlike the Secant and Regula-Falsi methods).
 * </p>
 * <p>
 * The max error, δ, is set equal to 2*Number.EPSILON*Math.abs(b) 
 * + Number.EPSILON after each iteration where b is the current best 
 * guess. A much larger δ of say 1e-10 does not really make sense
 * for polynomials since nearly always by that stage convergence 
 * proceeds superlinearly and by the next iteration a δ of
 * around Number.EPSILON is achieved. On the other hand, a δ of 
 * much less than Number.EPSILON is sometimes useful, say for finding  
 * the root of the polynomial x**2 - 3*x*1e-13 + 2*1e-26 to within less
 * than 1e-15, but this is rare enough not to be considered in this 
 * implementation. (For JavaScript doubles Number.EPSILON === 
 * 2.220446049250313e-16 and since b is typically around 1 the max δ 
 * will be about 3*2.220446049250313e-16 or about 1e-15. As another 
 * example, a root near -1000 will have a max error, i.e. δ, of 
 * about 1e-12. In conclusion, for roots near zero the error can be up
 * to Number.EPSILON or about 1e-15 - we don't bother to calculate the
 * root more accurately than this since it may require up to 4 or 5 
 * additional iterations.
 * </p>
 * <p> 
 * See <a href="https://en.wikipedia.org/wiki/Brent%27s_method">Wikipedia</a>
 * </p>
 * <p>
 * See <a href="https://maths-people.anu.edu.au/~brent/pd/rpb011i.pdf">Brent (page 47)</a>
 * </p>
 * @param {function} f - The function for which the root is sought.
 * @param {number} a - The lower limit of the search interval.
 * @param {number} b - The upper limit of the search interval.
 * @returns {number} An estimate of the root to within δ (typically 
 * about 1e-15).
 * @example
 * let p = FloPoly.fromRoots([-10,2,3,4]);  //=> [1, 1, -64, 236, -240]
 * let f = FloPoly.evaluate(p);
 * FloPoly.brent(f,2.2,3.8); //=> 3.000000000000003
 * FloPoly.brent(f,2.2,3.1); //=> 3.000000000000001
 */
function brent(f, a, b) {
	const EPS = Number.EPSILON; 
	
	if (a === b) {
		// Presumably the root is already found.
		return a; 
	} 
	
	// We assume on the first iteration f(a) !== 0 && f(b) !== 0. 
	let fa = f(a);
	let fb = f(b);
    
	if (fa*fb > 0) {
    	// Root is not bracketed - this is a precondition.
    	throw 'Root not bracketed'; 
    } 
    
    let c; // Value of previous guess - set to a initially 
    if (Math.abs(fa) < Math.abs(fb)) { 
    	// Swap a,b
    	c = a;  a = b;	b = c;
    	
    	// Swap fa,fb
    	let temp = fa;
    	fa = fb;
    	fb = temp;
    }
    
    c = a;
    
    let mflag = true;
    let d; // Value of guess before previous guess
    while (true) {
    	let δ = 2*EPS*Math.abs(b) + EPS;
    	
    	let fc = f(c);
    	
    	// Calculate provisional interpolation value
    	let s;
    	if (fa !== fc && fb !== fc) { 
    		// 3 points available - inverse quadratic interpolation
    		let fac = fa - fc;
    		let fab = fa - fb;
    		let fbc = fb - fc;
    		
    		// The below has been multiplied out to speed up the algorithm.
    		/*s = ((a * fb * fc) / ( fab * fac)) +
    			  ((b * fa * fc) / (-fab * fbc)) +
    			  ((c * fa * fb) / ( fac * fbc));*/
    		s = ((a*fb*fbc - b*fa*fac)*fc + c*fa*fab*fb) / (fab*fac*fbc);
    	} else {
    		// only 2 points available - secant method
    		s = b - (fb * ((b-a)/(fb-fa)));
    	}
    	
    	let t1 = (3*a + b) / 4;
    	let b_c = Math.abs(b-c);
    	let s_b = Math.abs(s-b);
    	let c_d = Math.abs(c-d);
    	
    	if (
    		(!( // condition 1
    			(s > t1 && s < b) ||
    			(s < t1 && s > b)
    		)) || 
    		(mflag && ( 
   				// condition 2
    			(s_b >= b_c/2) ||
    			// condition 4
    			(b_c < δ) 
    		)) || 
    		(!mflag && (
   				// condition 3
    			(s_b >= c_d/2) ||
    			// condition 5
    			(c_d < δ) 
    		))
    	) {
    		// Bisection
    		s = (a + b) / 2;
    		mflag = true;
    	} else {
    		mflag = false;
    	}
    	
    	let fs = f(s);
    	
    	d = c;
    	c = b;
    	
    	if (fa*fs < 0) { b = s; } else { a = s; }
    	
    	if (Math.abs(fa) < Math.abs(fb)) { 
    		// Swap a,b
    		let temp = a;  a = b;  b = temp;
    	}
	    
	    if (fb === 0) { return b; } 
	    if (fs === 0) { return s; }

	    if (Math.abs(a - b) <= δ) {
	    	return b; 
	    }
	    
	    fa = f(a);
    	fb = f(b);
    }
}


module.exports = rootOperators;
