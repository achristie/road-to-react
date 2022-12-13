import { useState } from "react";
import "./App.css";
import React, { useEffect } from "react";
import { useReducer } from "react";
import { useCallback } from "react";
import { ReactComponent as Check } from "./check.svg";
import { useMemo } from "react";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

function App() {
  const [searchTerm, setSearchTerm] = useStorageState("search", "AWC2");
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFetchStories = useCallback(async () => {
    if (!searchTerm) return;

    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const result = await fetch(url).then((res) => res.json());

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = useCallback((item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  }, []);

  console.log("app");
  return (
    <div className="App">
      <SearchForm
        searchTerm={searchTerm}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
      {stories.isLoading ? (
        <h1>Loading!</h1>
      ) : (
        <Stories list={stories.data} handleRemove={handleRemoveStory} />
      )}
    </div>
  );
}

export default App;

const SearchForm = ({ searchTerm, handleSubmit, handleChange }) => {
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={searchTerm} onChange={handleChange} />
      <button disabled={!searchTerm} type="submit">
        Fetch
      </button>
      <Check height="18px" width="18px" fill="green" stroke="green" />
    </form>
  );
};

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    console.log("str state");
    localStorage.setItem(key, value);
  }, [value]);

  return [value, setValue];
};

const Stories = React.memo(
  ({ list, handleRemove }) =>
    console.log("list") || (
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
    )
);

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        data: action.payload,
        isLoading: false,
        isError: false,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter((story) => action.payload.name !== story.name),
      };

    default:
      throw new Error();
  }
};
