import Game from './utils/chess/Game'
import Board from './components/board/Board'
import { HumanPlayer } from './utils/chess/Player'

const App = () => {
  const p1 = new HumanPlayer(true)
  const p2 = new HumanPlayer(false)
  const game = new Game(p1, p2)
  return (
		<div>
      <Board board={game.board}/>
    </div>
  )
}

export default App
