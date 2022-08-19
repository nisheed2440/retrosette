import React from "react";
import logo from "./logo.svg";
import { useQuery } from "@tanstack/react-query";
import { getSearchResults } from "./utils";
import "./App.css";

function App() {
  const { data, isLoading, error } = useQuery(["authorize"], () => {
    return getSearchResults("Queen");
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <p>{isLoading ? "Loading..." : "Authorized"}</p>
      <p>{error ? (error as Error).message : ""}</p>
      <p>{data ? JSON.stringify(data) : ""}</p>
    </div>
  );
}

export default App;
