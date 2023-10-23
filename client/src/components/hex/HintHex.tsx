import './_Hex.css'
import Hex from '../../utils/chess/Hex'

interface HexProps {
    size: number
    hex: Hex,
}

const HintHex = ({size, hex}: HexProps) => {
    const [x, y] = hex.getPixel(size)
    if (hex.piece)
        return (
            <div 
                className={`hex hint capture ${hex.r},${hex.q}`} 
                style={{
                    width: size * 1.2, 
                    height: size * 1.2, 
                    top: y -  4.5 * size + (size - size * 1.2 / 2),
                    left: x + (size - size * 1.2 / 2)
                    }}
                >
            </div>
        )
    else
        return (
            <div 
                className={`hex hint ${hex.r},${hex.q}`} 
                style={{
                    width: size / 2, 
                    height: size / 2, 
                    top: y -  4.5 * size + (size - size /4),
                    left: x + (size - size/4)
                    }}
                >
            </div>
        )
}

export default HintHex