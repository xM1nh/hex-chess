import Hex from "./Hex";
import Piece from "./Piece";
import Board from "./Board";

export default class Pawn extends Piece {
    private _hasMoved: boolean = false
    private _canEnPassant: boolean = false
    private _bDelta: Set<string> = new Set<string>([
        '0,1,-1'
    ])
    private _wCaptureDelta: Set<string> = new Set<string>([
        '1,-1,0',
        '-1,0,1'
    ])
    private _bCaptureDelta: Set<string> = new Set<string>([
        '1,0,-1',
        '-1,1,0'
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
        const enPassantRow = this.white ? board.whiteEnPassantRow : board.blackEnPassantRow
        const captureDelta = this.white ? this._wCaptureDelta : this._bCaptureDelta
        if (end.piece?.white === this.white) {
            return false
        }

        const q = end.q - start.q
        const r = end.r - start.r
        const s = (-start.q - start.r) - (-end.q - end.r)

        if (end.piece === null) return false
        else {
            //If move to an empty square
            if (end.piece === undefined) {
                //If on en passant row
                if (enPassantRow.has(`${start.q},${start.r}`)) {
                    const previousMove = board.history[board.history.length - 1]
                    //If last move was a pawn move
                    if (previousMove.pieceMoved instanceof Pawn) {
                        //If it was a double pawn move
                        if (Math.abs(previousMove.start.r - previousMove.end.r) == 2) {
                            //If end Hex is directly above previous move pawn
                            if (Math.abs(end.r - previousMove.end.r) === 1 && end.q === previousMove.end.q) {
                                const delta = `${q},${r},${s}`
                                if (captureDelta.has(delta)) return true
                                return false
                            }
                        }
                    }
                }
                    if (q) return false
                    if (!this.hasMoved) {
                        if (this.white) return r === -1 || r === -2
                        else return r === 1 || r === 2
                    } else {
                        if (this.white) return r === -1
                        else return r === 1
                    }
            //If move to a non-empty square
            } else {
                const delta = `${q},${r},${s}`
                if (captureDelta.has(delta)) return true
                return false
            }
        }
    }

    public getAvailableMoves(board: Board, start: Hex): Hex[] {
        const captureDelta = this.white ? this._wCaptureDelta : this._bCaptureDelta
        const delta = this.white ? this._delta : this._bDelta
        const availableMoves: Hex[] = []
        for (const value of delta) {
            const startHex = board.getHex(start.q, start.r)
            
            const deltaR = parseInt(value.split(',')[1])
            
            let endR = start.r + deltaR
            if (endR < 0 || endR > 10 ) continue

            let endHex = board.getHex(start.q, endR)
            if (endHex.piece === null) continue
            if (this.canMove(board, startHex, endHex)) availableMoves.push(endHex)
            else continue

            if (!this.hasMoved) {
                endR = start.r + 2 * deltaR
                endHex = board.getHex(start.q, endR)
                if (this.canMove(board, startHex, endHex)) availableMoves.push(endHex)
            }

        }

        for (const value of captureDelta) {
            const startHex = board.getHex(start.q, start.r)
            
            const deltaR = parseInt(value.split(',')[1])
            
            const endR = start.r + deltaR
            if (endR < 0 || endR > 10 ) continue

            const endHex = board.getHex(start.q, endR)
            if (!this.canEnPassant && !endHex.piece) continue
            if (this.canMove(board, startHex, endHex)) availableMoves.push(endHex)
            else continue

        }
        return availableMoves
    }

    public ascii(): string {
        return this.white ? 'wp' : 'bp'
    }
}