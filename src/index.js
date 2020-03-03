import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./App.css";

async function getChangelog() {
  let packageName = window.location.pathname.substr(1);
  return fetch(`https://unpkg.com/${packageName}/CHANGELOG.md`).then(response =>
    response.text()
  );
}

function App() {
  const [changelog, updateChangelog] = useState(null);
  const [changelogStatus, updateStatus] = useState("loading");

  useEffect(() => {
    getChangelog()
      .then(text => {
        updateChangelog(text);
        updateStatus("loaded");
      })
      .catch(err => {
        console.log(err);
        updateStatus("failed");
      });
  });

  return (
    <div className="App">
      <header className="App-header">
        <h2>{changelogStatus}</h2>
        <p>{changelog}</p>
      </header>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
