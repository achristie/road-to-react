import { describe, it, expect } from "vitest";
import App, { storiesReducer, Stories, SearchForm } from "./App";
import { render } from "react";

describe("something truthy", () => {
  it("true is true", () => {
    expect(true).toBe(true);
  });
});

const storyOne = {
  title: "React",
  url: "https://reactjs.org",
  author: " Jordan Walke",
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: "redux",
  url: "https://redux.js.org",
  author: "Dan Abramov, Andrew Clark",
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

describe("storiesReducer", () => {
  it("removes a story from all stories", () => {
    const action = { type: "REMOVE_STORY", payload: storyOne };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);
    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });
});

// describe("SearchForm", () => {
//   const searchFormProps = {
//     handleSubmit: () => {},
//     searchTerm: "test",
//     handleChange: () => {},
//   };
//   it("renders snapshot", () => {
//     const { container } = render(<SearchForm {...searchFormProps} />);
//     expect(container.firstChild).toMatchSnapshot();
//   });
// });
