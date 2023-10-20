import Board from "./Board"
import Hex from "./Hex"

export default abstract class Piece {
    protected _delta: Set<string>
    private _killed: boolean = false
    private _white: boolean = false

    constructor(white: boolean) {
        this._white = white
        this._delta = new Set<string>()
    }

    public get delta() {
        return this._delta
    }

    public get white(): boolean {
        return this._white
    }

    public set white(white: boolean) {
        this._white = white
    }

    public get killed(): boolean {
        return this._killed
    }

    public set killed(killed: boolean) {
        this._killed = killed
    }

    public abstract canMove(board: Board, start: Hex, end: Hex): boolean 
    public abstract getAvailableMoves(board: Board, start: Hex): number[][]
}