import { useState } from 'react'
import useCounter from './hooks/useCounter'

const Display = ({ counter }) => {
  return <div>{counter}</div>
}

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>
}

const App = () => {
  const counter = useCounter()

  return (
    <div>
      <div>{counter.value}</div>
      <button onClick={counter.increase}>
        plus
      </button>
      <button onClick={counter.decrease}>
        minus
      </button>      
      <button onClick={counter.zero}>
        zero
      </button>
    </div>
  )
}

export default App