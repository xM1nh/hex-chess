import Hex from "./Hex"
import King from "./King"
import Queen from "./Queen"
import Bishop from "./Bishop"
import Knight from "./Knight"
import Rook from "./Rook"
import Pawn from "./Pawn"

const PIECE_MAPPING: {[key: string]: new (white: boolean) => Pawn | Rook | King | Knight | Queen | Bishop} = {
    'p': Pawn,
    'r': Rook,
    'n': Knight,
    'b': Bishop,
    'q': Queen,
    'k': King
}

const DEFAULT_POSITION = 
    '00000bknrpe/0000qbeepee/000nebepeee/00reeepeeee/0pppppeeeee/eeeeeeeeeee/eeeeePPPPP0/eeeePeeeR00/eeePeBeN000/eePeeBQ0000/ePRNKB00000 w '

export default class Board {
    private _board = new Array<Hex[]>(11).fill(new Array<Hex>(11))

    constructor(fen = DEFAULT_POSITION) {   
        this.resetBoard(fen)
    }

    public get board(): Hex[][] {
        return this._board
    }

    public resetBoard(fen: string): void {
        let r = 0, q = 0
        const tokens = fen.split(/\s+/)
        const position = tokens[0]

        for (let i = 0; i < position.length; i++) {
            const piece = position.charAt(i)

            if (piece === '/') {
                r++
                q = 0
            } else if (piece === '0') {
                this.board[r][q] = new Hex(q, r, null)
            } else if (piece === 'e') {
                this.board[r][q] = new Hex(q, r, undefined)
            } else {
                const white = piece < 'a' ? true : false
                const PieceClass = PIECE_MAPPING[piece]
                this.board[r][q] = new Hex(q, r, new PieceClass(white))
            }
            q++
        }
    }
}