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

    public set piece(p: Piece) {
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
}