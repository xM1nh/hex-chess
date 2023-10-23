import Board from '../../utils/chess/Board'
import './_Hex.css'

interface HexProps {
    q: number,
    r: number,
    size: number
    board: Board,
    visibility?: string
}

const HoverHex = ({q, r , size, board, visibility}: HexProps) => {
    const hex = board.getHex(q, r)
    const [x, y] = hex.getPixel(size)
    
    return (
        <div 
            className={`hex hover ${r},${q}`} 
            style={{
                width: size * 2, 
                height: size * 2, 
                top: y - 4.5 * size,
                left: x,
                visibility: visibility ? 'visible' : 'hidden'
                }}>
                    <svg height='100%' width='100%'>
                        <polygon points={`
                            0,${size}
                            ${size/2},${size*Math.cos(30)}
                            ${1.5 * size},${size*Math.cos(30)}
                            ${2 * size},${size}
                            ${1.5 * size},${ 2 * size - size*Math.cos(30)}
                            ${size/2},${ 2 * size - size*Math.cos(30)}
                        `}
                        stroke='rgba(255,255,255,0.65)'
                        strokeWidth='6'
                        fill='none'
                        />
                    </svg>
        </div>
    )
}

export default HoverHex