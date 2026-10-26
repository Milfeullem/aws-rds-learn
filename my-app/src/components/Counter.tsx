import React, { useState, useRef } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  const undoList = useRef([])
  const redoList = useRef([])
  
  const createIncreaseIncreaseCmd = () => {
    return {
      do: () => setCount(count =>count + 1),
      undo: () => setCount(count =>count - 1),
    }
  }
  const createDecreaseCmd = () => {
    return {
      do: () => setCount(count =>count - 1),
      undo: () => setCount(count =>count + 1),
    }
  }
  
  const handleIncrease = () => {
    const cmd = createIncreaseIncreaseCmd()
    cmd.do()
    undoList.current.push(cmd)
    redoList.current = []
  }
  const handleDecrease = () => {
    const cmd = createDecreaseCmd()
    cmd.do()
    undoList.current.push(cmd)
    redoList.current = []
  }
  const handleUndo = () => {
    const cmd = undoList.current.pop()
    if (cmd) {
      cmd.undo()
      redoList.current.push(cmd)
    }
  }
  const handleRedo = () => {
    const cmd = redoList.current.pop()
    if (cmd) {
      cmd.do()
      undoList.current.push(cmd)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex gap-3">
        <button onClick={handleDecrease}>-</button>
        <span>{count}</span>
        <button onClick={handleIncrease}>+</button>
      </div>
      <div className="flex gap-3">
        <button disabled={undoList.current.length === 0} onClick={handleUndo}>Undo</button>      
        <button disabled={redoList.current.length === 0} onClick={handleRedo}>Redo</button>      
      </div>
    </div>
  )
}
