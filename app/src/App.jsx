import { useState } from "react";
import "./App.css";
import React, { useEffect } from "react";
import { useReducer } from "react";
import { useCallback } from "react";
import { SearchForm } from "./components/SearchForm";
import { Stories } from "./components/Stories";
import { Toolbar } from "./components/Toolbar";
import { History } from "./components/History";
const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search/";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const getUrl = (searchTerm, page) =>
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

function App() {
  const [searchTerm, setSearchTerm] = useStorageState("search", "AWC2");
  const [urls, setUrls] = useState([getUrl(searchTerm, 0)]);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    page: 0,
    isLoading: false,
    isError: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm, 0);
    // setUrls(`${API_ENDPOINT}${searchTerm}`);
  };

  const handleSearch = (searchTerm, page) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFetchStories = useCallback(async () => {
    if (!searchTerm) return;

    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const lastUrl = urls[urls.length - 1];
      const result = await fetch(lastUrl).then((res) => res.json());

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: {
          list: result.hits,
          page: result.page,
        },
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls]);

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

  const fetchMore = () => {};

  return (
    <div className="App">
      <SearchForm
        searchTerm={searchTerm}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
      <Toolbar handleClick={handleSort} />
      <History items={urls} />
      <Stories list={stories.data} handleRemove={handleRemoveStory} />
      {stories.isLoading ? (
        <h1>Loading!</h1>
      ) : (
        <>
          <button onClick={() => handleSearch(searchTerm, stories.page + 1)}>
            More
          </button>
        </>
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
        data:
          action.payload.page === 0
            ? action.payload.list
            : state.data.concat(action.payload.list),
        page: action.payload.page,
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
