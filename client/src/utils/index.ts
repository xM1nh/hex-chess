export const pixelToHex = (x: number, y: number, size: number) => {
    //need this offset for some reason?
    x -= size
    y += 3.5 * size

    //actual conversion
    const q = ( 2 / 3 * x) / size
    const r = (-1 / 3 * x  +  Math.sqrt(3) / 3 * y) / size 
    return rounding(q, r, -q-r)
}

const rounding = (q: number, r: number, s: number) => {
    let roundedQ = Math.round(q)
    let roundedR = Math.round(r)
    let roundedS = Math.round(s)

    const q_diff = Math.abs(roundedQ - q)
    const r_diff = Math.abs(roundedR - r)
    const s_diff = Math.abs(roundedS - s)

    if (q_diff > r_diff && q_diff > s_diff) {
        roundedQ = - roundedR - roundedS
    } else if (r_diff > s_diff) {
        roundedR = - roundedQ - roundedS
    } else {
        roundedS = - roundedQ - roundedR
    }

    return {r: roundedR, q: roundedQ}
}