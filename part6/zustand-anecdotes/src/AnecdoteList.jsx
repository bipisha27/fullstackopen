import { useAnecdotes, useAnecdoteActions, useFilter } from "./store";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const { voteAnecdote, deleteAnecdote } = useAnecdoteActions();
  const filter = useFilter();

  const filteredAnecdotes = anecdotes.filter((a) =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedAnecdotes = filteredAnecdotes.toSorted(
    (a, b) => b.votes - a.votes
  );

  return (
    <div style={{ padding: 10 }}>
      {sortedAnecdotes.map((a) => (
        <div
          key={a.id}
          data-testid = "anecdote"
          style={{
            marginBottom: 10,
            padding: 10,
            border: "1px solid #ccc",
          }}
        >
          <div>{a.content}</div>

          <div>
            has {a.votes} votes
            <button onClick={() => voteAnecdote(a.id)}>vote</button>

            {a.votes === 0 && (
              <button onClick={() => deleteAnecdote(a.id)}>
                delete
              </button> //if left side ie a.votes===0 is true, return right side else dont return it - conditional rendering with short circuit evaluation
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;