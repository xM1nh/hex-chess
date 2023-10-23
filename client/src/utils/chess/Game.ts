import Board from "./Board";
import Move from "./Move";
import Pawn from "./Pawn";
import Player from "./Player";
import lodash from 'lodash'
import Piece from "./Piece";
import King from "./King";

type GameState = 'ACTIVE' | 'BLACK_WIN' | 'WHITE_WIN' | 'FORFEIT' | 'STALEMATE' | 'RESIGN'
const GAME_STATE: {
    ACTIVE: string,
    BLACK_WIN: string,
    WHITE_WIN: string,
    STALEMATE: string,
} = {
    ACTIVE: 'ACTIVE',
    BLACK_WIN: 'BLACK_WIN',
    WHITE_WIN: 'WHITE_WIN',
    STALEMATE: 'STATEMATE',
}

export default class Game {
    private _board: Board
    private _internalBoard: Board
    private _player: Player
    private _currentTurn: Player | undefined
    private _state: GameState

    constructor(player: Player) {
        this._board = new Board()
        this._internalBoard = new Board()
        this._player = player
        if (player.white) this._currentTurn = player
        this._state = 'ACTIVE'
    }

    public init(player: Player) {
        this._board = new Board()
        this._internalBoard = new Board()
        this._player = player
        if (player.white) this._currentTurn = player
        this._state = 'ACTIVE'
    }

    public get board() {
        return this._board
    }

    public get turn(): Player | undefined {
        return this._currentTurn
    }

    public set turn(player: Player | undefined) {
        this._currentTurn = player
    }

    public get state(): GameState {
        return this._state
    }

    public set state(state: GameState) {
        this._state = state
    }

    public isEnd() {
        return this.state !== GAME_STATE.ACTIVE
    }

    public playerMove(player: Player, startQ: number, startR: number, endQ: number, endR: number, promotion?: Piece) {
        const startHex = this.board.getHex(startQ, startR)
        const endHex = this.board.getHex(endQ, endR)
        const move = new Move(player, startHex, endHex, promotion)
        return this._makeMove(move, player)
    }

    private _makeMove(move: Move, player: Player): boolean {
        const piece = move.start.piece
        const endPiece = move.end.piece

        if (!piece) return false
        if (endPiece === null) return false
        if (player !== this.turn) return false
        if (piece.white !== player.white) return false
        if (!piece.canMove(this.board, move.start, move.end)) return false
        if (lodash.isEqual(move.start, move.end)) return false

        const startQ = move.start.q
        const startR = move.start.r
        const endQ = move.end.q
        const endR = move.end.r

        //Check if a move will result in a check
        const color = player.white ? 'w' : 'b'
        this._internalBoard.setHex(startQ, startR, undefined)
        this._internalBoard.setHex(endQ, endR, piece)
        if (piece instanceof King) {
            if (color === 'w') this._internalBoard.kings.w = move.end
            else this._internalBoard.kings.b = move.end
        }
        if (this._internalBoard.isCheck(color)) {
            //Undo to previous state
            this._internalBoard.setHex(startQ, startR, piece)
            this._internalBoard.setHex(endQ, endR, endPiece)
            this._internalBoard.kings.w = this._board.kings.w
            this._internalBoard.kings.b = this._board.kings.b
            return false
        }

        if (endPiece) {
            endPiece.killed = true
            move.pieceKilled = endPiece
        }

        this._board.deleteActiveHex(move.start)
        this._internalBoard.deleteActiveHex(move.start)

        move.end.piece = move.start.piece
        move.start.piece = undefined

        if (piece instanceof Pawn) {
            piece.hasMoved = true
        }

        if (piece instanceof King) {
            if (color === 'w') this._board.kings.w = move.end
            else this._board.kings.b = move.end
        }

        this._board.setHex(startQ, startR, undefined)
        this._internalBoard.setHex(startQ, startR, undefined)

        //Promotion
        if (move.promotion) {
            if (!(piece instanceof Pawn)) return false
            const end = piece.white ? this._board.lastRow : this._board.firstRow
            if (!end.has(`${endQ},${endR}`)) return false 
            this._board.setHex(endQ, endR, move.promotion)
            this._internalBoard.setHex(endQ, endR, move.promotion)
            this._board.addActiveHex(move.end)
            this._internalBoard.addActiveHex(move.end)
        } else {
            this._board.setHex(endQ, endR, move.end.piece)
            this._internalBoard.setHex(endQ, endR, move.end.piece)
            this._board.addActiveHex(move.end)
            this._internalBoard.addActiveHex(move.end)
        }

        this._board.addToHistory(move)
        this._internalBoard.addToHistory(move)

        if (this._board.isCheckMate(color)) {
            if (color === 'w') this.state = 'BLACK_WIN'
            else this.state = 'WHITE_WIN'
        }

        if (this._board.isStaleMate(color)) this.state = 'STALEMATE'

        // if (!this.turn) this.turn = this._player
        // else this.turn = undefined

        return true
    }

    public resign(player: Player) {
        if (player.white) this.state = 'BLACK_WIN'
        else this.state = 'WHITE_WIN'
    }
}