import Board from './assets/Board.png'

const App = () => {
  return (
		<div style={{height: '90vh', backgroundColor: 'black', width: 'fit-content'}}>
      <img style={{height: '100%', objectFit: 'contain'}} src={Board}></img>
    </div>
  )
}

export default App
