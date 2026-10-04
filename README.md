# Excalidraw Vue Starter

A Vue drawing-workspace foundation with a complete tool palette, shape defaults, theme controls, and an interactive design system. Drawing is intentionally not implemented yet.

## Run

Use Node 22.22 or newer and pnpm 10.28.2.

```sh
pnpm install
pnpm dev
```

Open the address printed by Vite. Open the workspace menu, then **Design system**, to inspect the live tokens and components. Preferences for theme and accent persist in browser localStorage. Canvas names, tool selection, zoom, and shape defaults last for the current session. No drawing is saved.

## Available now

- Tool selection by pointer or keyboard, tool lock, stroke/fill/style defaults, and opacity.
- Zoom controls for the background grid, a grid toggle, and responsive style-panel access.
- Workspace menu, library empty state, help with implemented shortcuts, and accessible dialogs.
- Light/dark themes and three accent choices, reflected immediately in the editor and design board.
- Disabled sharing, history, document actions, and library import communicate their future availability.

Drawing, canvas object selection, document persistence, undo/redo, image import, exports, collaboration, and library imports are not implemented. Zoom currently changes only the background grid; there are no document objects yet.

## Architecture

`src/app` composes features through their public entry points. Each feature owns its state and named commands. Vue readonly views prevent components from directly mutating feature state.

| Feature        | Responsibility                                             |
| -------------- | ---------------------------------------------------------- |
| toolbox        | Tool registry, active tool, lock, new-shape defaults       |
| viewport       | Zoom limits and grid visibility                            |
| appearance     | Theme/accent state and injected preference storage         |
| library        | Honest empty library presentation                          |
| design-preview | Interactive composition of the real design-system controls |

Pure domain modules do not import Vue or browser APIs. The appearance feature has a synchronous `PreferencesPort`. Its localStorage adapter validates external data with Valibot and returns typed `Result` failures. The app constructs the adapter. Storage failures keep the workspace usable and produce a visible message.

There is no document model or rendering engine yet. Future drawing can introduce those capabilities without treating the current UI state as document history.

## Design system

Tailwind CSS 4.3.3 runs through `@tailwindcss/vite` and the CSS-first `@theme inline` bridge; no JavaScript Tailwind configuration is needed. Use semantic utilities such as `bg-surface`, `text-muted`, and `rounded-control` for shared controls and layout. Button variants use complete, statically discoverable class strings. Editor-specific geometry and complex selectors remain in `editor.css`.

Primitive tokens live in `src/design-system/tokens/primitives.css`. Semantic light/dark and accent roles live in `semantic.css`. `styles.css` exposes Tailwind utilities for those roles, type scales, spacing, radii, and shadows. Shared buttons and dialogs use these tokens. The design board renders the same components and live CSS variables as the editor.

## Verification

```sh
pnpm format:check
pnpm typecheck
pnpm lint
pnpm test:unit
pnpm test:browser
pnpm test:e2e
pnpm build
pnpm verify
```

Install Google Chrome once with `pnpm exec playwright install chrome`.

Unit tests cover parsing, failure behavior, shortcut lookup, zoom limits, and architecture violations. Architecture fixtures run the real Oxlint CLI with the custom boundary plugin. Browser Mode tests exercise Vue controls and actual browser storage. Gherkin scenarios execute through Playwright against the production build on port 43719, including reload persistence, focus restoration, keyboard handling, and narrow-screen controls. CI installs Google Chrome and runs the same verification commands.

Functional tests do not establish pixel-perfect appearance or full accessibility compliance. Desktop and narrow-layout visual inspection is a separate review step.

## Visual reference

The editor chrome follows the actual public Excalidraw UI inspected on 2026-10-04, with source inspection at Excalidraw commit `ed10ac7dca7e40f3f4a31269b4bfba980d0db41e`. Desktop tools float at the top, mobile tools at the bottom; additional tools open from the overflow menu. Shape properties appear only for relevant tools. The main menu retains app-specific appearance, grid, canvas-name, and design-system controls.

The starter opens directly to an empty workspace. Unavailable actions, app-specific menu entries and limited library behavior deliberately reflect this foundation. It is not the official Excalidraw app and is not a pixel-identical implementation of every state.

Adapted Excalidraw SVG icons and welcome artwork retain the MIT license in `public/licenses/excalidraw-MIT.txt`. Assistant and Excalifont font license notices are in `public/licenses/`.

## License

MIT. Third-party assets retain their notices in `public/licenses/`.
