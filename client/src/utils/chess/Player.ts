export default abstract class Player {
    private _white: boolean
    private _human: boolean

    constructor(white: boolean, human: boolean) {
        this._white = white
        this._human = human
    }

    public get white(): boolean {
        return this._white
    }

    public get human(): boolean {
        return this._human
    }
}

export class HumanPlayer extends Player {
    constructor(white: boolean) {
        super(white, true)
    }
}

export class ComputerPlayer extends Player {
    constructor(white: boolean) {
        super(white, false)
    }
}