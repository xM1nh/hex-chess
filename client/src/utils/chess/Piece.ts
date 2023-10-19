import Hex from "./Hex"

export default abstract class Piece {
    private _killed: boolean = false
    private _white: boolean = false

    constructor(white: boolean) {
        this._white = white
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

    public abstract canMove(start: Hex, end: Hex): boolean 
}