import BoardImg from './assets/Board.png'
import Game from './utils/chess/Game'
import { HumanPlayer } from './utils/chess/Player'

const App = () => {
  const p1 = new HumanPlayer(true)
  const p2 = new HumanPlayer(false)
  const game = new Game(p1, p2)
  console.log(game)
  return (
		<div style={{height: '90vh', backgroundColor: 'black', width: 'fit-content'}}>
      <img style={{height: '100%', objectFit: 'contain'}} src={BoardImg}></img>
    </div>
  )
}

export default App
