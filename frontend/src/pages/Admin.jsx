import { useState } from 'react';
import SearchForm from '../components/SearchBox';
import AdminList from '../components/AdminList';

const Search = () => {
    const [results,setResults] = useState([]);


  return (
    <div className="container mx-auto p-6">
      <SearchForm setResults={setResults} />
      <AdminList tasks={results} setResults={setResults} />
    </div>
  );
};


export default Search;