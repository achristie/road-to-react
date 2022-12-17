import { ReactComponent as Check } from "../../check.svg";

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

export { SearchForm };
