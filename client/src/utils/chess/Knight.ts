import Hex from "./Hex";
import Piece from "./Piece";

export default class Knight extends Piece {
    private _delta: Set<string> = new Set<string>([
        '3,-2,-1', 
        '2,-3,1', 
        '1,-3,2', 
        '-1,-2,3', 
        '-2,-1,3', 
        '-3,1,2',
        '-3,2,1',
        '-2,3,-1',
        '-1,3,-2',
        '1,2,-3',
        '2,1,-3',
        '3,-1,-2'
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