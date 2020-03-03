/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";

import "./index.css";
import "./App.css";

async function getChangelog(packageName) {
  // Watch this space - this function is going to get way more complicated, trust me
  return fetch(`https://unpkg.com/${packageName}/CHANGELOG.md`).then(
    response => {
      console.log("🕸", response);
      return response.text();
    }
  );
}

const statusMessage = {
  loading: () => "fetching the changelog for you",
  loaded: () => "",
  failed: () =>
    "something went wrong loading this! please raise an issue including the url you typed at https://github.com/thinkmill/changelog-xyz"
};

function App() {
  const packageName = window.location.pathname.substr(1);
  const [changelog, updateChangelog] = useState(null);
  const [changelogStatus, updateStatus] = useState("loading");

  useEffect(() => {
    getChangelog(packageName)
      .then(text => {
        updateChangelog(text);
        updateStatus("loaded");
      })
      .catch(err => {
        console.log(err);
        updateStatus("failed");
      });
  });

  const Message = statusMessage[changelogStatus];

  return (
    <div
      css={{
        padding: "24px"
      }}
    >
      <div>
        <h1 css={{ textAlign: "center" }}>XYZ changelog: {packageName}</h1>
        <h2 css={{ textAlign: "center" }}>
          <Message />
        </h2>
        <div
          css={{
            margin: "0 auto",
            maxWidth: "680px"
          }}
        >
          <ReactMarkdown source={changelog} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
