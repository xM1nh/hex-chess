import Hex from "./Hex";
import Piece from "./Piece";

export default class Rook extends Piece {
    constructor(white: boolean) {
        super(white)
    }

    public canMove(start: Hex, end: Hex): boolean {
        if (end.piece?.white && this.white) {
            return false
        }

        const startS = -start.q - start.r
        const endS = -end.q - end.r

        return start.q === end.q || start.r === end.r || startS === endS
    }
}