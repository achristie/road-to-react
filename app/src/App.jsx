import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import { useReducer } from "react";
import { useCallback } from "react";

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

  const handleFetchStories = useCallback(() => {
    if (!searchTerm) return;

    dispatchStories({ type: "STORIES_FETCH_INIT" });
    getAsyncStories(url).then((result) => {
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.hits,
      });
    });
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Fetch</button>
      </form>
      {stories.isLoading ? (
        <h1>Loading!</h1>
      ) : (
        <ul>{stories.data.map((s) => Stories(s, handleRemoveStory))}</ul>
      )}
    </div>
  );
}

export default App;

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);

  return [value, setValue];
};

function Stories(item, handleRemove) {
  return (
    <li key={item.objectID}>
      {item.title}
      <button type="button" onClick={() => handleRemove(item)}>
        Remove
      </button>
    </li>
  );
}

async function getAsyncStories(url) {
  let resp = await fetch(url).then((res) => res.json());
  return resp;
}

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
