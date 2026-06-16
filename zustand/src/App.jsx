import {create} from 'zustand'

const useCounterStore = create(set => ({
  counter: 0,
  increment: () => set(state => ({counter: state.counter + 1})),
  decrement: () => set(state => ({counter: state.counter - 1})),
  zero: () => set(() => ({counter: 0}))
}))

const App = () => {
  const counter = useCounterStore(state => state.counter)
  const increment = useCounterStore(state => state.increment)
  const decrement = useCounterStore(state => state.decrement)
  const zero = useCounterStore(state => state.zero)

return (
  <div>
    <Display />
    <Controls />
  </div>
)
}

export default App