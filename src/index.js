/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";

import "./index.css";

async function getChangelog(packageName) {
  let packageInfoResponse = await fetch(
    `https://unpkg.com/${packageName}/?meta`
  );

  if (packageInfoResponse.status === 404) {
    return {
      status: "error",
      type: "packagenotfound"
    };
  }

  let { files } = await packageInfoResponse.json();
  let changelog = files.find(({ path }) => path.match(/changelog\.md/i));

  if (changelog) {
    return fetch(`https://unpkg.com/${packageName}${changelog.path}`)
      .then(res => res.text())
      .then(text => {
        return {
          status: "success",
          changelog: text
        };
      });
  }

  return {
    status: "error",
    type: "filenotfound"
  };
}

const FailWhale = () => (
  <h2 css={{ textAlign: "center" }}>
    something went wrong loading this!{" "}
    <a href="https://github.com/Thinkmill/changelogs-xyz/issues">
      please raise an issue
    </a>{" "}
    including the full url
  </h2>
);

const ErrorMessage = ({ type, text, packageName }) => {
  if (type === "text") {
    return text;
  }

  if (type === "filenotfound") {
    return (
      <div>
        <p>
          We couldn't resolve the file. It may be we don't support the format
          yet.
        </p>
        <p>
          You can check over on{" "}
          <a href={`https://unpkg.com/browse/${packageName}/`}>unpkg</a> to see
          if we missed it
        </p>
        <p>
          If we did -{" "}
          <a href="https://github.com/Thinkmill/changelogs-xyz/issues">
            please raise an issue
          </a>{" "}
        </p>
      </div>
    );
  }

  if (type === "packagenotfound") {
    return (
      <p>
        We couldn't find the package: {packageName} - perhaps a wild typo has
        appeared?
      </p>
    );
  }
  return "This is a completely unknown error";
};

function App() {
  const packageName = window.location.pathname.substr(1);
  const [changelog, updateChangelog] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (packageName) {
      setLoading(true);
      getChangelog(packageName)
        .then(text => {
          setLoading(false);
          if (text.status === "error") {
            setErrorMessage(text);
          } else {
            updateChangelog(text.changelog);
          }
        })
        .catch(err => {
          setLoading(false);
          return err.text().then(message => {
            if (!message) {
              setErrorMessage({
                type: "text",
                text: "This is a completely unknown error"
              });
            } else {
              setErrorMessage({ type: "text", text: "message" });
            }
          });
        });
    }
  }, [packageName]);

  return (
    <div
      css={{
        padding: "24px",
        maxWidth: "640px",
        margin: "0 auto"
      }}
    >
      <div>
        <h1 css={{ textAlign: "center" }}>changelogs.xyz: {packageName}</h1>
        <p>
          Thanks for using changelogs.xyz! Just add a package name to the URL
          and we'll (try to) show you its changelog!
        </p>
        <p>(We are very in beta right now)</p>
        {isLoading && (
          <h2 css={{ textAlign: "center" }}>fetching the changelog for you</h2>
        )}
        {!packageName && (
          <p>
            For example, you could go to{" "}
            <a href="https://changelogs.xyz/@changesets/cli">
              changelogs.xyz/@changesets/cli
            </a>{" "}
            to see the changelog changesets
          </p>
        )}
        {errorMessage && (
          <div>
            <FailWhale />
            <ErrorMessage {...errorMessage} packageName={packageName} />
          </div>
        )}
        <ReactMarkdown source={changelog} />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
