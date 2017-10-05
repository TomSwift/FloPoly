'use strict'

var mocha;
var chai;
var FloPoly;

if (typeof require === 'undefined') {
	// Browser
} else {
	// Node
	mocha   = require('mocha');
	chai    = require('chai');
	FloPoly = require('../../js/flo-poly.js');
}

var { assert, expect } = chai;
var { equal } = FloPoly;
var { flatCoefficientsArr } = FloPoly.random;

describe('random.flatCoefficientsArr', function() {
	it('should predictably generate an array of polynomials with coefficients in a flat random distribution', 
	function() {
		let res;
		
		res = flatCoefficientsArr(2,3,-2,2);
		assert(equal(res[0], [0.1749166026711464, -0.20349335670471191, 0.9375684261322021]));
		assert(equal(res[1], [1.0617692470550537, -1.8918039798736572, 0.8040215969085693]));
		
		res = flatCoefficientsArr(2,3,-2,2);
		assert(equal(res[0], [0.1749166026711464, -0.20349335670471191, 0.9375684261322021]));
		assert(equal(res[1], [1.0617692470550537, -1.8918039798736572, 0.8040215969085693]));
	});
});