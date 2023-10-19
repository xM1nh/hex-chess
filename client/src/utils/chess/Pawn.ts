import Hex from "./Hex";
import Piece from "./Piece";

export default class Pawn extends Piece {
    private _hasMoved: boolean = false

    constructor(white: boolean) {
        super(white)
    }

    public get hasMoved(): boolean {
        return this._hasMoved
    }

    public set hasMoved(hasMoved: boolean) {
        this._hasMoved = hasMoved
    }

    public canMove(start: Hex, end: Hex): boolean {
        if (end.piece?.white && this.white) {
            return false
        }

        const q = start.q - end.q
        const r = start.r - end.r

        if (q) return false

        if (!this.hasMoved) {
            return r === 1 || r === 2
        } else {
            return r === 1
        }
    }
}