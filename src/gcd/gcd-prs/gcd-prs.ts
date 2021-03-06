
import { subresultantPseudoRemainderSequence as subresultantPseudoRemainderSequence_ } from "../../remainder-sequences/subresultant-pseudo-remainder-sequence";
import { expIsZero as expIsZero_ } from "../../basic/is-zero";

// We *have* to do the below❗ The assignee is a getter❗ The assigned is a pure function❗ Otherwise code is too slow❗
const subresultantPseudoRemainderSequence = subresultantPseudoRemainderSequence_;
const expIsZero = expIsZero_;


/**
 * Returns the gcd of the two given polynomials using Pseudo Remainder 
 * Sequences (PRSs).
 * @param a a polynomial
 * @param b another polynomial
 */
function gcdExact(a: number[][], b: number[][]): number[][] {
    let isZeroA = expIsZero(a);
    let isZeroB = expIsZero(b);
    if (isZeroA) {
        return b;
    } else if (isZeroB) {
        return a;
    }
    
    let seq = subresultantPseudoRemainderSequence(a,b,false);

    return seq[seq.length-1];
}


export { gcdExact }
