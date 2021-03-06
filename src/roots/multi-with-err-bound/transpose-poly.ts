

/**
 * Transposes the given polynomial coefficients into multiple polynomials.
 * @param p 
 */
function transposePoly(p: number[][]) {
    // transpose the polynomial coefficients into multiple polynomials
	let len = p[0].length;
	let p_: number[][] = [];
	for (let i=0; i<len; i++) {
		let _p: number[] = [];
		for (let j=0; j<p.length; j++) {
			_p.push(p[j][len-(i+1)]); // from highest to lowest
		}
		p_.push(_p);
    }
    
    return p_;
}


export { transposePoly }
