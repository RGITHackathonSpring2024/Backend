import * as crypto from 'crypto'
export default function randomBigInt(max: bigint | number | string): bigint;
export default function randomBigInt(min: bigint | number | string, max: bigint | number | string): bigint;
export default function randomBigInt(min: bigint | number | string, max?: bigint | number | string): bigint {
    if (max === undefined) return randomBigInt(0n, min);
    // choose if you want to allow not-bigints yourself
    // this wrapper allows `bigint | number | string` (you may want to keep at least `bigint | number`
    min = BigInt(min); 
    max = BigInt(max);

    // choose what happens when input order is invalid (e.g. throw error)
    // this wrapper keeps `min` in and `max` out of generatable numbers
    if (min <= max)
      return min + _generateRandomBigInt(max - min);
    else 
      return max - 1n - _generateRandomBigInt(min - max);
}

/**
 * This is tha basic function to generate random bigint.
 * @param max exclusive maximum
 * (c) <CC-BY-SA-4.0 or Unlicense> Dimava, 2023
 */
function _generateRandomBigInt(max: bigint): bigint {
    if (max < 0) throw new Error("generateRandomBigInt cannot generate negative BigInt");
    if (max === 0n) return 0n;

    const POWER = 64n;
    const FILTER = (1n << POWER) - 1n;

    // 1. Create an BigInt64Array representation of max number
    let num = max;
    const maxList: bigint[] = [];
    while (num) {
        maxList.unshift(num & FILTER);
        num >>= POWER;
    }
    const maxArray = BigInt64Array.from(maxList);

    // 2. Generate the random number
    const rndArray = crypto.getRandomValues(maxArray.slice());

    // 3. Trim the random number highest bits 
    // to reduce failure rate to <50%
    let trim = 1n;
    while (maxArray[0] > trim) trim <<= 1n;
    trim--;
    rndArray[0] &= trim;

    // 4. Convert to bigint
    let rnd = 0n;
    for (let i = 0; i < rndArray.length; i++) {
        rnd <<= POWER;
        rnd += rndArray[i];
    }

    // 5. Check for failure (the random number being higher then max)
    // and retry if needed
    if (rnd >= max) return _generateRandomBigInt(max);
    return rnd;
}