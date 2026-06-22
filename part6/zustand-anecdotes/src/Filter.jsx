import { useAnecdoteActions } from "./store";

const Filter = () => {
  const { setFilter } = useAnecdoteActions();

  return (
    <div style={{ marginBottom: 10 }}>
      filter{" "}
      <input onChange={(e) => setFilter(e.target.value)} />
    </div>
  );
};

export default Filter;