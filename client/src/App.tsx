import Game from './utils/chess/Game'
import Board from './components/board/Board'
import { HumanPlayer } from './utils/chess/Player'

const App = () => {
  const player = new HumanPlayer(true)
  const game = new Game(player)
  const moveFn = game.playerMove.bind(game)
  return (
		<div>
      <Board board={game.board} moveFn={moveFn} player={player}/>
    </div>
  )
}

export default App
