import Hex from "./Hex";
import Piece from "./Piece";

export default class Bishop extends Piece {
    private _delta: Set<string> = new Set<string>([
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
        if (end.piece.white && this.white) {
            return false
        }

        const q = start.q - end.q
        const r = start.r - end.r
        const s = (-start.q - start.r) - (-end.q - end.r)

        const direction = Math.max(Math.abs(q), Math.abs(r), Math.abs(s))

        const factor = direction % 2
        const delta = `${q/factor},${r/factor},${s/factor}`

        if (this._delta.has(delta)) return true
        else return false
    }
}