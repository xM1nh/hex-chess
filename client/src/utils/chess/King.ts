import Hex from "./Hex";
import Piece from "./Piece";

export default class King extends Piece {
    private _delta: Set<string> = new Set<string>([
        '1,-1,0',
        '0,-1,1',
        '-1,0,1',
        '-1,1,0',
        '0,1,-1',
        '1,0,-1',
        '2,-1,-1',
        '1,-2,1',
        '-1,-1,2',
        '-2,1,1',
        '-1,2-1',
        '1,1,-2'
    ])

    constructor(white: boolean) {
        super(white)
    }

    public canMove(start: Hex, end: Hex): boolean {
        if (end.piece?.white && this.white) {
            return false
        }

        const q = start.q - end.q
        const r = start.r - end.r
        const s = (-start.q - start.r) - (-end.q - end.r)
        const delta = `${q},${r},${s}`

        if (this._delta.has(delta)) return true
        else return false
    }
}