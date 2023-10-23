import Hex from "./Hex";
import Piece from "./Piece";
import Board from "./Board";

export default class Rook extends Piece {
    constructor(white: boolean) {
        super(white)
        this._delta = new Set<string>([
            '1,0,-1',
            '1,-1,0',
            '0,-1,1',
            '-1,0,1',
            '-1,1,0',
            '0,1,-1'
        ])
    }

    public canMove(board: Board, start: Hex, end: Hex): boolean {
        if (end.piece?.white === this.white) {
            return false
        }

        const q = start.q - end.q
        const r = start.r - end.r
        const s = (-start.q - start.r) - (-end.q - end.r)

        const factor = Math.max(Math.abs(q), Math.abs(r), Math.abs(s))

        const delta = `${q/factor},${r/factor},${s/factor}`
        if (end.piece === null) return false
        else {   
            if (this.delta.has(delta)) {
                let middlePiece: Piece | undefined = undefined
                let startQ = start.q, startR = start.r
                
                //break condition. rook can only travel for a maximum of 11 hexes
                for (;;) {
                    if (middlePiece) break
                    const endQ = startQ - q/factor, endR = startR - r/factor

                    if (endQ === end.q && endR === end.r) return true
                    if (board.getHex(endQ, endR).piece) middlePiece = board.getHex(endQ, endR).piece as Piece
    
                    startQ = endQ
                    startR = endR
                }
            }
            
            return false
        }
    }

    public getAvailableMoves(board: Board, start: Hex): Hex[] {
        const availableMoves: Hex[] = []
        for (const value of this.delta) {
            let middlePiece: Piece | undefined = undefined
            let startQ = start.q, startR = start.r
            
            const deltas = value.split(',')
            const deltaQ = parseInt(deltas[0])
            const deltaR = parseInt(deltas[1])
            for (let i = 0; i < 11; i++) {
                if (middlePiece) break
                const endQ = startQ + deltaQ, endR = startR + deltaR

                if (endR < 0 || endR > 10 || endQ < 0 || endQ > 10) break
                const startHex = board.getHex(startQ, startR)
                const endHex = board.getHex(endQ, endR)

                if (endHex.piece === null) break
                if (endHex.piece && endHex.piece.white !== this.white) middlePiece = endHex.piece
                if (this.canMove(board, startHex, endHex)) availableMoves.push(endHex)
                else break

                startQ = endQ
                startR = endR
            }
        }
        return availableMoves
    }

    public ascii(): string {
        return this.white ? 'wr' : 'br'
    }
}