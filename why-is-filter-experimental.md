# Why is filter experimental?

Hey! Thanks for taking an interest in this project.

The filter method, at the moment, is taken directly from a previous project. It's designed with the output of [changesets](https://github.com/changesets/changesets/) in mind, that is to say:

```markdown
## 2.0.0

Some text
```

The format is, each version has a h2 containing the version number (and nothing but the version number). Things that adhere to this will work. Other things...

## I want to filter a changelog not in that format

Seems fair. If you want to roll your sleeves up, you can dive into our [changelog utils](https://github.com/Thinkmill/untitled-docs/tree/master/packages/changelog-utils), but if you don't want to, raise an issue with a link to the failing `changelogx.xyz page`. Thanks!
