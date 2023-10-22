import HexClass from '../../utils/chess/Hex'
import './_Hex.css'
import {MouseEventHandler} from 'react'

interface HexProps {
    size: number
    hex: HexClass,
    handleClick: MouseEventHandler<HTMLDivElement>
}

const Hex = ({size, hex, handleClick}: HexProps) => {
    const [x, y] = hex.getPixel(size)
    if (hex.piece)
    return (
        <div 
        className={`hex ${hex.piece?.ascii()} ${hex.r},${hex.q}`} 
        style={{
            width: size * Math.sqrt(2), 
            height: size * Math.sqrt(2), 
            top: y -  4.5 * size + (size - size * Math.sqrt(2) / 2),
            left: x + (size - size * Math.sqrt(2) / 2)
            }}
        onMouseDown={handleClick}
        >
        </div>
    )
}

export default Hex