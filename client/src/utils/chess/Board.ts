import Hex from "./Hex"
import Piece from "./Piece"
import King from "./King"
import Queen from "./Queen"
import Bishop from "./Bishop"
import Knight from "./Knight"
import Rook from "./Rook"
import Pawn from "./Pawn"
import Move from "./Move"

export type Color = 'w' | 'b'

export const PIECE_MAPPING: {[key: string]: new (white: boolean) => Pawn | Rook | King | Knight | Queen | Bishop} = {
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
    private _history: Move[] = []
    private _activeWhiteHex: Set<string> = new Set<string>()
    private _activeBlackHex: Set<string> = new Set<string>()
    private _kings: {w: Hex, b: Hex} = {
        w: new Hex(0, 0, null),
        b: new Hex(0, 0, null)
    }
    private _lastRow: Set<string> = new Set<string>([
        '0,5', '1,4', '2,3', '3,2', '4,1', '5,0', '6,0', '7,0', '8,0', '9,0', '10,0'
    ])
    private _firstRow: Set<string> = new Set<string>([
        '0,10', '1,10', '2,10', '3,10', '4,10', '5,10', '6,9', '7,8', '8,7', '9,6', '10,5'
    ])
    private _wEnPassantRow: Set<string> = new Set<string>([
        '0,10', '1,9', '2,8', '3,7', '4,6', '5,5', '6,5', '7,5', '8,5', '9,5', '10,5'
    ])
    private _bEnPassantRow: Set<string> = new Set<string>([
        '0,5', '1,5', '2,5', '3,5', '4,5', '5,5', '6,4', '7,3', '8,2', '9,1', '10,0'
    ])

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

    public get firstRow(): Set<string> {
        return this._firstRow
    }

    public get lastRow(): Set<string> {
        return this._lastRow
    }

    public get whiteEnPassantRow(): Set<string> {
        return this._wEnPassantRow
    }

    public get blackEnPassantRow(): Set<string> {
        return this._bEnPassantRow
    }

    public set kings(hex: Hex) {
        if (hex.piece?.white) {
            this.kings.w = hex
        } else {
            this.kings.b = hex
        }
    }

    public get history(): Move[] {
        return this._history
    }

    public addToHistory(move: Move) {
        this._history.push(move)
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
        this._history = []
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
        const activeHexes = color === 'w' ? this.activeWhiteHex : this.activeBlackHex
        for (const value of activeHexes) {
            const q = parseInt(value.split(',')[1])
                const r = parseInt(value.split(',')[0])
                const activeHex = this.getHex(q, r)
                if ((activeHex.piece as Piece).getAvailableMoves(this, activeHex).length > 0) return false
        }

        if (this.isCheck(color)) return true
        return false
    }

    public isStaleMate(color: Color): boolean {
        const activeHexes = color === 'w' ? this.activeWhiteHex : this.activeBlackHex
        for (const value of activeHexes) {
            const q = parseInt(value.split(',')[1])
                const r = parseInt(value.split(',')[0])
                const activeHex = this.getHex(q, r)
                if ((activeHex.piece as Piece).getAvailableMoves(this, activeHex).length > 0) return false
        }

        if (!this.isCheck(color)) return true
        return false
    }
}