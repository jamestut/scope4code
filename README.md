# cscope4code Personal Modifications

The original version of this extension and can be found [here](https://github.com/xulion/scope4code). Shoutout to [@xulion](https://github.com/xulion) for such a simple yet effective extension!

This is my personal modification of this extension to better suit my need. Following modifications are done so far:

- Do not automatically create `.vscode/cscope` folder upon extension startup.
  - Create the aforementioned folder during database build.
- Removed cscope readiness check upon extension startup.
- Can change `databasePath` without having to reload window.

