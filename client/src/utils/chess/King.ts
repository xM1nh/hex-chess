import Hex from "./Hex";
import Piece from "./Piece";
import Board from "./Board";
import Pawn from "./Pawn";

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
        if (end.piece?.white === this.white) {
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
                    const q = value[1]
                    const r = value[0]
                    const activeHex = board.getHex(q, r)
                    if (activeHex.piece instanceof King || activeHex.piece instanceof Pawn) continue
                    if (activeHex.piece?.canMove(board, activeHex, end)) {
                        return false}
                }

                //Check King manually to prevent infinite recursion
                for (const value of this.delta) {
                    const deltaQ = parseInt(value.split(',')[0])
                    const deltaR = parseInt(value.split(',')[1])
                    const endQ = end.q + deltaQ
                    const endR = end.r + deltaR
                    if (endR < 0 || endR > 10 || endQ < 0 || endQ > 10) continue
                    const hex = board.getHex(endQ, endR)
                    if (hex.piece instanceof King && hex.piece.white !== this.white) return false
                    if (hex.piece instanceof Pawn && hex.piece.white !== this.white) {
                        if (this.white) {
                            if ((deltaQ === -1 && deltaR === 0) || (deltaQ === 1 && deltaR === -1)) return false
                        }
                        else {
                            if ((deltaQ === -1 && deltaR === 1) || (deltaQ === 1 && deltaR === 0)) return false
                        }
                    }
                }
    
                return true
            }
    
            return false
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
        return this.white ? 'wk' : 'bk'
    }
}