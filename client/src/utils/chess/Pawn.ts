import Hex from "./Hex";
import Piece from "./Piece";
import Board from "./Board";

export default class Pawn extends Piece {
    private _hasMoved: boolean = false
    private _canEnPassant: boolean = false
    private _captureDelta: Set<string> = new Set<string>([
        '1, -1, 0',
        '-1, 0, 1'
    ])

    constructor(white: boolean) {
        super(white)
        this._delta = new Set<string>([
            `0,-1,1`
        ])
    }

    public get hasMoved(): boolean {
        return this._hasMoved
    }

    public set hasMoved(hasMoved: boolean) {
        this._hasMoved = hasMoved
    }

    public get canEnpassant(): boolean {
        return this._canEnPassant
    }

    public set canEnPassant(canEnPassant: boolean) {
        this._canEnPassant = canEnPassant
    }

    public canMove(board: Board, start: Hex, end: Hex): boolean {
        if (end.piece?.white && this.white) {
            return false
        }

        const q = start.q - end.q
        const r = start.r - end.r
        const s = (-start.q - start.r) - (-end.q - end.r)

        if (end.piece === null) return false
        else {
            if (!end.piece) {
                if (!this.canEnPassant) {
                    if (q) return false

                    if (!this.hasMoved) {
                        return r === 1 || r === 2
                    } else {
                        return r === 1
                    }
                } else {
                    const delta = `${q},${r},${s}`
                    if (this._captureDelta.has(delta)) return true
                    return false
                }
            } else {
                const delta = `${q},${r},${s}`
                if (this._captureDelta.has(delta)) return true
                return false
            }
        }
    }

    public getAvailableMoves(board: Board, start: Hex): number[][] {
        const availableMoves: number[][] = []
        for (const value of this.delta) {
            let startQ = start.q, startR = start.r
            const startHex = board.getHex(startQ, startR)
            
            const deltas = value.split(',')
            const deltaQ = parseInt(deltas[0])
            const deltaR = parseInt(deltas[1])
            
            const endQ = start.q + deltaQ, endR = start.r + deltaR
            const endHex = board.getHex(endQ, endR)

            if (endQ < 0 || endR < 0 || endQ < 0 || endQ > 10 || endHex.piece === null) break
            if (this.canMove(board, startHex, endHex)) availableMoves.push([endQ, endR])
            else break

            startQ = endQ
            startR = endR
        }

        for (const value of this._captureDelta) {
            let startQ = start.q, startR = start.r
            const startHex = board.getHex(startQ, startR)
            
            const deltas = value.split(',')
            const deltaQ = parseInt(deltas[0])
            const deltaR = parseInt(deltas[1])
            
            const endQ = start.q + deltaQ, endR = start.r + deltaR
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