@TEAM.md

# Claude Code

The contract above is the whole of how we work. What follows is only what
Claude Code needs beyond it.

- `team <section>` prints one part of the contract; `team doctor` checks a
  machine. `aide`, `alignment`, `lens` and `agents` are the team's tools.
- Save what would hurt to lose into the project's records, not into chat.

## Defaults

- Prefer American English spelling when possible.

Move to each project's `collaboration/rules/` as those exist.

- Prefer small interfaces, and the simplest tool first.
- Match the shapes and names the project already uses.
- Prefer a functional core with imperative edges.
- Prefer JavaScript with TS types in JSDoc, or TypeScript. Avoid Python.
- Prefer DenoJS. Prefer Vite, React, ShadCN, TailwindCSS.
- Move business logic, rules, workflows, effects and state up and out of React.
  `useEffect` and `useState` only in leaf nodes (specialized inputs, DOM work).
- Web UI follows `@A11Y.md`.
