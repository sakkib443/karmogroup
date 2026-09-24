# Supply-chain guard — read this

## What happened
An infected developer machine repeatedly appended an **obfuscated crypto-stealer
payload** to `client/postcss.config.mjs`. That file is executed automatically by
Next.js on **every `npm run dev` / `npm run build`**, so anyone who pulled the
poisoned commit and ran the app would run the malware. The payload pulls in
`http`/`https`/`child_process` and beacons to Ethereum RPC hosts (wallet theft).

Only that one file was ever poisoned — no page/component/data code was affected.

## The guard in this repo
- **`.githooks/pre-commit`** — blocks committing the payload from any file.
- **`.githooks/post-merge` / `post-checkout`** — after a pull or branch switch,
  auto-restores `client/postcss.config.mjs` to clean if the payload rode in, so
  it can never run. You can pull safely even if someone re-pushes the poison.
- **`.gitattributes`** — `client/postcss.config.mjs merge=ours`, so a merge keeps
  your clean copy.
- **`client/scripts/setup-git-guard.mjs`** — wires the above into local git.

## Enable it (one time per machine)
Runs automatically after `npm install` (the `prepare` script). To enable by hand:

```bash
git config core.hooksPath .githooks
git config merge.ours.driver true
```

## If your machine is the infected one
You'll know if `client/postcss.config.mjs` changes back on its own after
`npm run dev` (`git status` shows it modified with a huge one-line diff). Then:

1. `cd client && rm -rf node_modules package-lock.json && npm ci`
2. Rotate your GitHub token/password; move any crypto wallet keys.
3. Re-check `git status` after a fresh `npm run dev`.
