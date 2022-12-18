const History = ({ handleClick, items }) => {
  console.log(items);
  return (
    <ul>
      {items.map((i) => (
        <li onClick={handleClick} key={i}>
          <button>{i}</button>
        </li>
      ))}
    </ul>
  );
};

export { History };
