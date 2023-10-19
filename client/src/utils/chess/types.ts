export type Color = 'w' | 'b'
export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'

export type Piece = {
    color: Color
    type: PieceSymbol
}