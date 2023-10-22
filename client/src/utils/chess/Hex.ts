import Piece from "./Piece"

export default class Hex {
    private _piece: Piece | null | undefined
    private _q: number
    private _r: number

    constructor(q: number, r: number, p: Piece | null | undefined) {
        this._piece = p
        this._q = q
        this._r = r
    }

    public get piece(): Piece | null | undefined {
        return this._piece
    }

    public set piece(p: Piece | null | undefined) {
        this._piece = p
    }

    public get q(): number {
        return this._q
    }

    public set q(q: number) {
        this._q = q
    }

    public get r(): number {
        return this._r
    }

    public set r(r: number) {
        this._r = r
    }

    public getPixel(size: number) {
        const x = size * (3/2 * this.q)
        const y = size * (Math.sqrt(3)/2 * this.q + Math.sqrt(3) * this.r)
        return [x, y]
    }
}