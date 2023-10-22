import './_Board.css'
import Hex from '../../utils/chess/Hex'
import HexElement from '../hex/Hex'
import HintHex from '../hex/HintHex'
import {useRef, useState, useEffect, Fragment, MouseEvent} from 'react'
import BoardClass from '../../utils/chess/Board'

interface BoardProps {
    board: BoardClass
}

const Board = ({board}: BoardProps) => {
    const boardRef= useRef<HTMLDivElement>(null)
    const [boardState, setBoardState] = useState<Hex[][]>(board.board)
    const [hintHexes, setHintHexes] = useState<Hex[]>([])
    const [hexSize, setHexSize] = useState(0)

    const handleHexClick = (e: MouseEvent<HTMLDivElement>) => {
        const coords = (e.target as HTMLDivElement).className.split(' ')[2].split(',')
        const r = parseInt(coords[0])
        const q = parseInt(coords[1])
        const hex = board.board[r][q]
        const availableMoves = hex.piece ? hex.piece.getAvailableMoves(board, hex) : []
        setHintHexes(availableMoves)
    }

    useEffect(() => {
        if (boardRef.current) {
            setHexSize(boardRef.current.offsetWidth / 17)
        }
    }, [board])

    return (
        <div className='board' ref={boardRef}>
            {boardState.map((row, i) => {
                return (
                    <Fragment key={`row${i}`}>
                        {
                            row.map(hex => {
                                return <HexElement 
                                    size={hexSize} 
                                    hex={hex} 
                                    key={`${hex.r}${hex.q}`}
                                    handleClick={(e: MouseEvent<HTMLDivElement>) => handleHexClick(e)}/>
                            })
                        }
                    </Fragment>
                )
            })}
            {
                hintHexes.map(hex => {
                    return (
                        <HintHex 
                            size={hexSize} 
                            hex={hex} 
                            key={`hint${hex.r}${hex.q}`}/>
                    )
                })
            }
        </div>
    )
}

export default Board