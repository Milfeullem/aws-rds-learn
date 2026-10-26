import {useState} from 'react'

export default function Board() {
  const [squares, setSquares] = useState(new Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)

  const handleClick = (i) => {
    const squaresCopy = squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    squaresCopy[i] = isXNext ? 'X' : 'O'
    setSquares(squaresCopy)
    setIsXNext(!isXNext)
  }

  function calculateWinner(squares) {
    if (squares.every(square => square)) {
      return 'drawer'
    }

    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i< lines.length; i++) {
      const [a, b, c] = lines[i]

      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }

    return null
  }

  const winner = calculateWinner(squares)
  const status = winner ? `Winner: ${winner}` : `Next Player: ${isXNext ? 'X' : 'O'}`

  return (
    <div style={{maxWidth: '200px'}}>
      <div style={{clear: 'both'}}>
        {Array.from({length: 9}).map((_, i) => (
          <Square key={i} value={squares[i]} onClick={() => handleClick(i)} />
        ))}
      </div>
      <div style={{clear: 'both', marginTop: '20px'}}>{status}</div>
    </div>
  )
}
