import { useState } from "react";
import "./App.css";
import React, { useEffect } from "react";
import { useReducer } from "react";
import { useCallback } from "react";
import { SearchForm } from "./components/SearchForm";
import { Stories } from "./components/Stories";
import { Toolbar } from "./components/Toolbar";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

function App() {
  const [searchTerm, setSearchTerm] = useStorageState("search", "AWC2");
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const handleSort = useCallback((type) => {
    dispatchStories({
      type: "SORT_TITLE",
    });
  }, []);

  return (
    <div className="App">
      <SearchForm
        searchTerm={searchTerm}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
      <Toolbar handleClick={handleSort} />
      {stories.isLoading ? (
        <h1>Loading!</h1>
      ) : (
        <Stories list={stories.data} handleRemove={handleRemoveStory} />
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
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    case "SORT_TITLE":
      return {
        ...state,
        data: state.data.sort((a, b) => (a.title > b.title ? 1 : -1)),
      };

    default:
      throw new Error();
  }
};

export { storiesReducer, SearchForm, Stories };
