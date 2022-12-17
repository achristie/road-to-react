function Toolbar({ handleClick }) {
  return (
    <div>
      <button onClick={() => handleClick("topic")}>Topic</button>
    </div>
  );
}

export { Toolbar };
