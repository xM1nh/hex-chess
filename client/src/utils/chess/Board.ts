import Hex from "./Hex"
import Piece from "./Piece"
import King from "./King"
import Queen from "./Queen"
import Bishop from "./Bishop"
import Knight from "./Knight"
import Rook from "./Rook"
import Pawn from "./Pawn"

export type Color = 'w' | 'b'

const PIECE_MAPPING: {[key: string]: new (white: boolean) => Pawn | Rook | King | Knight | Queen | Bishop} = {
    'p': Pawn,
    'r': Rook,
    'n': Knight,
    'b': Bishop,
    'q': Queen,
    'k': King
}

const DEFAULT_POSITION = 
    '00000bknrpe/0000qbeepee/000nebepeee/00reeepeeee/0pppppeeeee/eeeeeeeeeee/eeeeePPPPP0/eeeePeeeR00/eeePeBeN000/eePeeBK0000/ePRNQB00000'

export default class Board {
    private _board: Hex[][] = new Array<Hex[]>()
    private _activeWhiteHex: Set<string> = new Set<string>()
    private _activeBlackHex: Set<string> = new Set<string>()
    private _kings: {w: Hex, b: Hex} = {
        w: new Hex(0, 0, null),
        b: new Hex(0, 0, null)
    }

    constructor(fen = DEFAULT_POSITION) {   
        this.resetBoard(fen)
    }

    public get board(): Hex[][] {
        return this._board
    }

    public get activeWhiteHex(): Set<string> {
        return this._activeWhiteHex
    }

    public get activeBlackHex(): Set<string> {
        return this._activeBlackHex
    }

    public get kings(): {w: Hex, b: Hex} {
        return this._kings
    }

    public set kings(hex: Hex) {
        if (hex.piece?.white) {
            this.kings.w = hex
        } else {
            this.kings.b = hex
        }
    }

    public isActiveHex(hex: Hex) {
        return this.activeWhiteHex.has(`${hex.r},${hex.q}`) || this.activeBlackHex.has(`${hex.r},${hex.q}`)
    }

    public addActiveHex(hex: Hex) {
        if (hex.piece?.white) {
            this._activeWhiteHex.add(`${hex.r},${hex.q}`)
        } else {
            this._activeBlackHex.add(`${hex.r},${hex.q}`)
        }
    }

    public deleteActiveHex(hex: Hex) {
        if (hex.piece?.white) {
            this._activeWhiteHex.add(`${hex.r},${hex.q}`)
        } else {
            this._activeBlackHex.add(`${hex.r},${hex.q}`)
        }
    }

    public resetBoard(fen: string): void {
        let r = 0, q = 0, row: Hex[] = []

        for (let i = 0; i < fen.length; i++) {
            const piece = fen.charAt(i)

            if (piece === '/') {
                r++
                q = 0
                this._board.push(row)
                row = []
                continue
            } else if (piece === '0') {
                row.push(new Hex(q, r, null))
            } else if (piece === 'e') {
                row.push(new Hex(q, r, undefined))
            } else {
                const white = piece < 'a' ? true : false
                const PieceConstructor = PIECE_MAPPING[piece.toLowerCase()]
                row.push(new Hex(q, r, new PieceConstructor(white)))

                if (piece < 'a') {
                    this._activeWhiteHex.add(`${r},${q}`)
                    this.kings.w = new Hex(q, r, new PieceConstructor(white))
                }
                else {
                    this._activeBlackHex.add(`${r},${q}`)
                    this.kings.b = new Hex(q, r, new PieceConstructor(white))
                }
            }
            q++
        }
        this._board.push(row)
    }

    public getHex(q: number, r: number) {
        return this._board[r][q]
    }

    public setHex(q: number, r: number, piece: Piece | undefined | null) {
        this._board[r][q].piece = piece
    }

    public isCheck(color: Color): boolean {
        const kingHex = color === 'w' ? this.kings.w : this.kings.b
        const opponentActiveHex = color === 'w' ? this.activeBlackHex : this.activeWhiteHex
            for (const value of opponentActiveHex) {
                const q = parseInt(value.split(',')[1])
                const r = parseInt(value.split(',')[0])
                const activeHex = this.getHex(q, r)
                if (!activeHex.piece?.canMove(this, activeHex, kingHex)) return true
            }
        return false
    }

    public isCheckMate(color: Color): boolean {
        const kingHex = color === 'w' ? this.kings.w : this.kings.b
        return this.isCheck(color) && kingHex.piece?.getAvailableMoves(this, kingHex).length === 0
    }

    public isStaleMate(color: Color): boolean {
        const kingHex = color === 'w' ? this.kings.w : this.kings.b
        return !this.isCheck(color) && kingHex.piece?.getAvailableMoves(this, kingHex).length === 0
    }
}