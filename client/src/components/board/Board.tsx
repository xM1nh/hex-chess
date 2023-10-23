import './_Board.css'
import Hex from '../../utils/chess/Hex'
import Piece from '../../utils/chess/Piece'
import Player from '../../utils/chess/Player'
import HexElement from '../hex/Hex'
import HintHex from '../hex/HintHex'
import HoverHex from '../hex/HoverHex'
import {useRef, useState, useEffect, Fragment, MouseEvent, DragEvent} from 'react'
import BoardClass from '../../utils/chess/Board'
import { pixelToHex } from '../../utils'

interface BoardProps {
    board: BoardClass,
    moveFn: (player: Player, startQ: number, startR: number, endQ: number, endR: number, promotion?: Piece | undefined) => boolean,
    player: Player
}

const Board = ({board, moveFn, player}: BoardProps) => {
    const boardRef= useRef<HTMLDivElement>(null)
    const [boardState, setBoardState] = useState<Hex[][]>(board.board)
    const [hintHexes, setHintHexes] = useState<Hex[]>([])
    const [hoverHexCoords, setHoverHexCoords] = useState<{r: number, q: number}>({r: 0, q: 0})
    const [hoverHexVisibility, setHoverHexVisibility] = useState<string>('hidden')
    const [hexSize, setHexSize] = useState(0)

    const handleHexClick = (e: MouseEvent<HTMLDivElement>) => {
        const coords = (e.target as HTMLDivElement).className.split(' ')[2].split(',')
        const r = parseInt(coords[0]), q = parseInt(coords[1])
        const hex = board.board[r][q]
        const availableMoves = hex.piece ? hex.piece.getAvailableMoves(board, hex) : []
        setHintHexes(availableMoves)
    }

    const handleOnDragStart = (e: DragEvent<HTMLDivElement>) => {
        window.requestAnimationFrame(() => {
            (e.target as HTMLDivElement).style.visibility = 'hidden'
        })
        const coords = (e.target as HTMLDivElement).className.split(' ')[2].split(',')
        const r = parseInt(coords[0]), q = parseInt(coords[1])
        e.dataTransfer.setData('start', `${r},${q}`)
        const hex = board.getHex(q, r)
        const availableMoves = hex.piece ? hex.piece.getAvailableMoves(board, hex) : []
        setHintHexes(availableMoves)
        setHoverHexVisibility('visible')
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const boundingRect = (boardRef.current as HTMLDivElement).getBoundingClientRect()
        const x = e.clientX - boundingRect.left, y = e.clientY - boundingRect.top
        const {r, q} = pixelToHex(x, y, hexSize)
        if (r >= 0 && r <= 10 && q >= 0 && q <= 10) setHoverHexCoords({r, q})
    }

    const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
        (e.target as HTMLDivElement).style.visibility = 'visible'
        e.preventDefault()
        const boundingRect = (boardRef.current as HTMLDivElement).getBoundingClientRect()
        const x = e.clientX - boundingRect.left, y = e.clientY - boundingRect.top
        const {r: endR, q: endQ} = pixelToHex(x, y, hexSize)
        setHoverHexVisibility('hidden')
        setHoverHexCoords({r: 0, q: 0})
        if (endR < 0 || endR > 10 || endQ < 0 || endQ > 10) return
        const startCoords = e.dataTransfer.getData('start') as string
        const start = startCoords.split(',')
        const startR = parseInt(start[0]), startQ = parseInt(start[1])
        const isMoved = moveFn(player, startQ, startR, endQ, endR)
        if (isMoved) {
            const startHex = board.getHex(startQ, startR)
            const endHex = board.getHex(endQ, endR)
            const newState = boardState.map<Hex[]>((row: Hex[], r): Hex[] => {
                row.map<Hex>((hex: Hex, q) => {
                    if (r === startR && q === startQ) hex = startHex
                    else if (r === endR && q === endQ) hex = endHex
                    return hex
                })
                return row
            })
            setHintHexes([])
            setBoardState(newState)
        }
    }


    useEffect(() => {
        if (boardRef.current) {
            setHexSize(boardRef.current.offsetWidth / 17)
        }
    }, [board.board, boardRef.current?.offsetHeight])

    return (
        <div className='board' ref={boardRef} onDragOver={handleDragOver}>
            {boardState.map((row, i) => {
                return (
                    <Fragment key={`row${i}`}>
                        {
                            row.map(hex => {
                                return <HexElement 
                                    size={hexSize} 
                                    hex={hex} 
                                    key={`${hex.r}${hex.q}`}
                                    handleClick={(e: MouseEvent<HTMLDivElement>) => handleHexClick(e)}
                                    handleOnDragStart={(e: DragEvent<HTMLDivElement>) => handleOnDragStart(e)}
                                    handleOnDragEnd={handleDragEnd}/>
                            })
                        }
                    </Fragment>
                )
            })}
            {
                hintHexes.map((hex, i) => {
                    return (
                        <HintHex 
                            size={hexSize} 
                            hex={hex} 
                            key={`hint${hex.r}${hex.q}${i}`}/>
                    )
                })
            }
            <HoverHex size={hexSize} board={board} r={hoverHexCoords.r} q={hoverHexCoords.q} visibility={hoverHexVisibility}/>
        </div>
    )
}

export default Board