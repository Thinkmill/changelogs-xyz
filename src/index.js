/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";

import "./index.css";
import "./App.css";

async function getChangelog(packageName) {
  // Watch this space - this function is going to get way more complicated, trust me

  // TODO do this better thing instead
  // https://unpkg.com/@changesets/cli@2.5.2/?meta

  return fetch(`https://unpkg.com/${packageName}/?meta`)
    .then(res => {
      return res.json();
    })
    .then(({ files }) => {
      let changelog = files.find(({ path }) => path.match(/changelog\.md/i));

      if (changelog) {
        return fetch(`https://unpkg.com/${packageName}${changelog.path}`).then(
          response => {
            if (response.status !== 200) throw response;
            return {
              status: "success",
              changelog: response.text()
            };
          }
        );
      } else {
        console.log("got here");

        return {
          status: "error",
          type: "filenotfound"
        };
      }
    });
}

const FailWhale = () => (
  <h2 css={{ textAlign: "center" }}>
    something went wrong loading this!{" "}
    <a href="https://github.com/Thinkmill/changelog-xyz/issues">
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
          <a href="https://github.com/Thinkmill/changelog-xyz/issues">
            please raise an issue
          </a>{" "}
        </p>
      </div>
    );
  }
  return "This is a completely unknown error";
};

function App() {
  const packageName = window.location.pathname.substr(1);
  const [changelog, updateChangelog] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
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
          /*
            error text to handle:
                `Cannot find package...`
                `Cannot find "FILENAME" in pkg@version`
          */

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
  }, [packageName]);

  return (
    <div
      css={{
        padding: "24px"
      }}
    >
      <div>
        <h1 css={{ textAlign: "center" }}>XYZ changelog: {packageName}</h1>
        <p>
          Thanks for using changelog.xyz! Just add a package name to the URL and
          we'll (try to) show you its changelog!
        </p>
        <p>We are very in beta right now, </p>
        {isLoading && (
          <h2 css={{ textAlign: "center" }}>fetching the changelog for you</h2>
        )}
        {errorMessage && (
          <div>
            <FailWhale />
            <ErrorMessage {...errorMessage} packageName={packageName} />
          </div>
        )}
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
