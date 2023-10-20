import Hex from "./Hex";
import Piece from "./Piece";
import Board from "./Board";

export default class King extends Piece {
    constructor(white: boolean) {
        super(white)
        this._delta = new Set<string>([
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
    }

    public canMove(board: Board, start: Hex, end: Hex): boolean {
        if (end.piece?.white && this.white) {
            return false
        }
        if (end.piece === null) return false

        const q = start.q - end.q
        const r = start.r - end.r
        const s = (-start.q - start.r) - (-end.q - end.r)
        const delta = `${q},${r},${s}`

        if (end.piece === null) return false
        else {
            if (this.delta.has(delta)) {
                const opponentActiveHex = this.white ? board.activeBlackHex : board.activeWhiteHex
                for (const value of opponentActiveHex) {
                    const q = parseInt(value.split(',')[1])
                    const r = parseInt(value.split(',')[0])
                    const activeHex = board.getHex(q, r)
                    if (!activeHex.piece?.canMove(board, activeHex, end)) return false
                }
    
                return true
            }
    
            return false
        }
    }

    public getAvailableMoves(board: Board, start: Hex): number[][] {
        const availableMoves: number[][] = []
        for (const value of this.delta) {
            let startQ = start.q, startR = start.r
            
            const deltas = value.split(',')
            const deltaQ = parseInt(deltas[0])
            const deltaR = parseInt(deltas[1])
            
            const endQ = start.q + deltaQ, endR = start.r + deltaR
            const startHex = board.getHex(startQ, startR)
            const endHex = board.getHex(endQ, endR)

            if (endQ < 0 || endR < 0 || endQ < 0 || endQ > 10 || endHex.piece === null) break
            if (this.canMove(board, startHex, endHex)) availableMoves.push([endQ, endR])
            else break

            startQ = endQ
            startR = endR
        }
        return availableMoves
    }
}