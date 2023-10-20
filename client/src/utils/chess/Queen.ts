import Hex from "./Hex";
import Piece from "./Piece";
import Board from "./Board";

export default class Queen extends Piece {

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

        const q = start.q - end.q
        const r = start.r - end.r
        const s = (-start.q - start.r) - (-end.q - end.r)

        const direction = Math.max(Math.abs(q), Math.abs(r), Math.abs(s))

        if (end.piece === null) return false
        else {
            if (!q || !r || !s) {
                const delta = `${q/direction},${r/direction},${s/direction}`
    
                if (this.delta.has(delta)) {
                    let startQ = start.q, startR = start.r
    
                    for (;;) {
                        const endQ = startQ - q, endR = startR - r
                        
                        if (endQ === end.q && endR === end.r) return true
                        if (board.getHex(endQ, endR).piece) return false
    
                        startQ = endQ
                        startR = endR
                    }
                }
    
                return false
            } else {
                const factor = direction % 2
                const delta = `${q/factor},${r/factor},${s/factor}`
    
                if (this.delta.has(delta)) {
                    let startQ = start.q, startR = start.r
    
                    for (;;) {
                        const endQ = startQ - q, endR = startR - r
                        
                        if (endQ === end.q && endR === end.r) return true
                        if (board.getHex(endQ, endR).piece) return false
    
                        startQ = endQ
                        startR = endR
                    }
                }
    
                return false
            }
        }
    }

    public getAvailableMoves(board: Board, start: Hex): number[][] {
        const availableMoves: number[][] = []
        for (const value of this.delta) {
            let startQ = start.q, startR = start.r
            
            const deltas = value.split(',')
            const deltaQ = parseInt(deltas[0])
            const deltaR = parseInt(deltas[1])
            for (;;) {
                const endQ = start.q + deltaQ, endR = start.r + deltaR
                const startHex = board.getHex(startQ, startR)
                const endHex = board.getHex(endQ, endR)

                if (endQ < 0 || endR < 0 || endQ < 0 || endQ > 10 || endHex.piece === null) break
                if (this.canMove(board, startHex, endHex)) availableMoves.push([endQ, endR])
                else break

                startQ = endQ
                startR = endR
            }
        }
        return availableMoves
    }
}