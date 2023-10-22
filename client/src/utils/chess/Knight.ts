import Hex from "./Hex";
import Piece from "./Piece";
import Board from "./Board";

export default class Knight extends Piece {
    constructor(white: boolean) {
        super(white)
        this._delta = new Set<string>([
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
    }
    
    public canMove(board: Board, start: Hex, end: Hex): boolean {
        if (end.piece?.white === this.white) {
            return false
        }
        
        const q = start.q - end.q
        const r = start.r - end.r
        const s = (-start.q - start.r) - (-end.q - end.r)

        const delta = `${q},${r},${s}`
        if (end.piece === null) return false
        else {
            if (this.delta.has(delta)) return true
            else return false
        }
    }

    public getAvailableMoves(board: Board, start: Hex): Hex[] {
        const availableMoves: Hex[] = []
        for (const value of this.delta) {
            
            const deltas = value.split(',')
            const deltaQ = parseInt(deltas[0])
            const deltaR = parseInt(deltas[1])
            
            const endQ = start.q + deltaQ, endR = start.r + deltaR
            if (endR < 0 || endR > 10 || endQ < 0 || endQ > 10) continue
            const startHex = board.getHex(start.q, start.r)
            const endHex = board.getHex(endQ, endR)

            if (endHex.piece === null) continue
            if (this.canMove(board, startHex, endHex)) availableMoves.push(endHex)
            else continue

        }
        return availableMoves
    }

    public ascii(): string {
        return this.white ? 'wn' : 'bn'
    }
}