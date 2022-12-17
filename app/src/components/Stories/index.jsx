import { memo } from "react";
const Stories = memo(
  ({ list, handleRemove }) =>
    console.log(list) || (
      <ul>
        {list.map((item) => (
          <li key={item.objectID}>
            {item.title}
            <button type="button" onClick={() => handleRemove(item)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    ),
  areEqual
);

function areEqual(prev, next) {
  console.log("ac", JSON.stringify(prev.list), JSON.stringify(next));
  return JSON.stringify(prev.list) == JSON.stringify(next.list);
  // return false;
}

export { Stories };
