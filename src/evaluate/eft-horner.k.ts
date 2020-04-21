
import { EFTHorner } from "./eft-horner";


function EFTHornerK(p: number[], x: number, K: number) {
	let ps = [p];
	let hs: number[] = [];
	let card = (2**K)-1; // size of the tree, i.e. cardinality of the nodes
	for (let i=0; i<card; i++) {
		let { r̂, pπ, pσ } = EFTHorner(ps[i], x);
		hs.push(r̂);
		ps.push(pπ);
		ps.push(pσ);
	}
	
	return { hs, ps: ps.slice(2**(K-1)) };
}


export { EFTHornerK }
