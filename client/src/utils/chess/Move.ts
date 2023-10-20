import Hex from "./Hex";
import Piece from "./Piece";
import Player from "./Player";

export default class Move {
    private _player: Player
    private _start: Hex
    private _end: Hex
    private _pieceMoved: Piece | null | undefined
    private _pieceKilled: Piece | null | undefined

    constructor(player: Player, start: Hex, end: Hex) {
        this._player = player
        this._start = start
        this._end = end
        this._pieceMoved = start.piece
        this._pieceKilled = end.piece
    }

    public get player(): Player {
        return this._player
    }

    public get start(): Hex {
        return this._start
    }

    public get end(): Hex {
        return this._end
    }

    public get pieceMoved(): Piece | null | undefined {
        return this._pieceMoved
    }

    public set pieceMoved(piece: Piece) {
        this._pieceMoved = piece
    }

    public get pieceKilled(): Piece | null | undefined {
        return this._pieceKilled
    }

    public set pieceKilled(piece: Piece) {
        this._pieceKilled = piece
    }
}