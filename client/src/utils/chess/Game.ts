import Board from "./Board";
import Move from "./Move";
import Player from "./Player";

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
    private _players: Player[]
    private _currentTurn: Player
    private _state: GameState
    private _history: Move[] = []

    constructor(p1: Player, p2: Player) {
        this._board = new Board()
        this._internalBoard = new Board()
        this._players = [p1, p2]
        if (p1.white) this._currentTurn = p1
        else this._currentTurn = p2
        this._state = 'ACTIVE'
    }

    public init(p1: Player, p2: Player) {
        this._board = new Board()
        if (p1.white) this._currentTurn = p1
        else this._currentTurn = p2
        this._history = []
        this._state = 'ACTIVE'
    }

    private _copyBoard() {
        this._internalBoard = structuredClone(this.board)
    }

    public get board() {
        return this._board
    }

    public get turn(): Player {
        return this._currentTurn
    }

    public set turn(player: Player) {
        this._currentTurn = player
    }

    public get state(): GameState {
        return this._state
    }

    public set state(state: GameState) {
        this._state = state
    }

    public get history(): Move[] {
        return this._history
    }

    private _addToHistory(move: Move) {
        this._history.push(move)
    }

    public isEnd() {
        return this.state !== GAME_STATE.ACTIVE
    }

    public playerMove(player: Player, startQ: number, startR: number, endQ: number, endR: number) {
        const startHex = this.board.getHex(startQ, startR)
        const endHex = this.board.getHex(endQ, endR)
        const move = new Move(player, startHex, endHex)
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

        const startQ = move.start.q
        const startR = move.start.r
        const endQ = move.end.q
        const endR = move.end.r

        //Check if a move will result in a check
        const color = player.white ? 'w' : 'b'
        this._internalBoard.setHex(startQ, startR, undefined)
        this._internalBoard.setHex(endQ, endR, piece)
        if (this._internalBoard.isCheck(color)) return false


        if (endPiece) {
            endPiece.killed = true
            move.pieceKilled = endPiece
        }
        move.end.piece = move.start.piece
        move.start.piece = undefined
        this.board.setHex(startQ, startR, undefined)
        this.board.setHex(endQ, endR, piece)
        this._copyBoard()

        this._addToHistory(move)

        if (this.board.isCheckMate(color)) {
            if (color === 'w') this.state = 'BLACK_WIN'
            else this.state = 'WHITE_WIN'
        }

        if (this.board.isStaleMate(color)) this.state = 'STALEMATE'

        if (this.turn === this._players[0]) this.turn = this._players[1]
        else this.turn = this._players[0]

        return true
    }

    public resign(player: Player) {
        if (player.white) this.state = 'BLACK_WIN'
        else this.state = 'WHITE_WIN'
    }
}