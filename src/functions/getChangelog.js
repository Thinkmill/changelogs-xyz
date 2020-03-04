export default async function getChangelog(packageName) {
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

  if (!changelog) {
    changelog = files.find(({ path }) => path.match(/history\.md/i));
  }

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
