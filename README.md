# 🎨 CRUD UI with React, Tailwind CSS and shadcn/ui

[![License: MIT](https://img.shields.io/badge/License-MIT-white.svg)](https://opensource.org/licenses/MIT)

Proof of Concept for a CRUD User Interface made with [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/). It consumes a RESTful API that manages the Argentina national football team squad data from the 2022 FIFA World Cup.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Build](#build)
- [API Reference](#api-reference)
- [Credits](#credits)
- [Terms](#terms)

## Features

- 🗂️ **Full CRUD operations** – List, create, read, update and delete players through a clean, consistent UI
- 🔍 **Client-side search** – Filter the squad instantly by name, position, team or squad number without extra API calls
- 🧩 **shadcn/ui components** – Production-quality Table, Dialog, Badge, Card, Input, Select and more, all accessible and keyboard-navigable
- 🎨 **Tailwind CSS utility classes** – Styling composed directly in markup; no separate component CSS files needed
- 🔀 **React Router v7** – Declarative client-side routing with `<Routes>` / `<Route>`, `useParams`, `useNavigate` and `<Link>`
- 🛡️ **TypeScript throughout** – Strict types for the domain model, API layer and every React component; zero `any` usage
- ⚡ **Vite dev proxy** – All API calls are forwarded server-side to `localhost:9000`, eliminating CORS issues during development
- 💚 **Live health indicator** – A colour-coded badge in the header reflects the real-time status of the backend API

## Tech Stack

| Category | Technology |
| -------- | ---------- |
| **Language** | [TypeScript 5.9](https://github.com/microsoft/TypeScript) |
| **UI Library** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 7](https://vite.dev/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) |
| **Component Library** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Routing** | [React Router DOM 7](https://reactrouter.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

## Project Structure

```tree
src/
├── api/
│   └── players.ts           # All fetch() calls — one function per API endpoint
├── components/
│   ├── ui/                  # shadcn/ui auto-generated components (do not edit)
│   ├── Layout.tsx           # Sticky nav bar + page wrapper
│   ├── PlayerForm.tsx       # Shared controlled form (used by Create and Edit)
│   └── DeleteDialog.tsx     # Confirmation dialog before deletion
├── pages/
│   ├── PlayersPage.tsx      # List view with search, health badge and delete
│   ├── PlayerDetailPage.tsx # Read-only detail card
│   ├── PlayerCreatePage.tsx # New player form → POST /players
│   └── PlayerEditPage.tsx   # Pre-filled edit form → PUT /players/:id
├── types/
│   └── player.ts            # Player interface, PlayerInput, helpers, positions
├── App.tsx                  # BrowserRouter + Routes declaration
└── index.css                # Tailwind directives + shadcn/ui CSS design tokens
```

## Prerequisites

- [Node.js 22 LTS](https://nodejs.org/) or later
- One of the six sibling API projects running on `http://localhost:9000`:
  - [`Dotnet.Samples.AspNetCore.WebApi`](https://github.com/nanotaboada/Dotnet.Samples.AspNetCore.WebApi)
  - [`go-samples-gin-restful`](https://github.com/nanotaboada/go-samples-gin-restful)
  - [`java.samples.spring.boot`](https://github.com/nanotaboada/java.samples.spring.boot)
  - [`python-samples-fastapi-restful`](https://github.com/nanotaboada/python-samples-fastapi-restful)
  - [`rust-samples-rocket-restful`](https://github.com/nanotaboada/rust-samples-rocket-restful)
  - [`ts-node-samples-express-restful`](https://github.com/nanotaboada/ts-node-samples-express-restful)

## Quick Start

### Clone the repository

```shell
git clone https://github.com/nanotaboada/react-samples-tailwind-team.git
cd react-samples-tailwind-team
```

### Install dependencies

```shell
npm install
```

### Start the development server

```shell
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```shell
npm run build   # production bundle → dist/
npm run preview # serve the production bundle locally
```

## API Reference

The UI consumes the following endpoints, all served at `http://localhost:9000`:

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/players` | List all players |
| `GET` | `/players/:id` | Get player by ID |
| `GET` | `/players/squadnumber/:squadNumber` | Get player by squad number |
| `POST` | `/players` | Create a new player |
| `PUT` | `/players/:id` | Update an existing player |
| `DELETE` | `/players/:id` | Remove a player |
| `GET` | `/health` | API health check |

## Credits

The solution has been coded using [Visual Studio Code](https://code.visualstudio.com/) with the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extensions.

## Terms

All trademarks, registered trademarks, service marks, product names, company names, or logos mentioned on this repository are the property of their respective owners. All usage of such terms herein is for identification purposes only and constitutes neither an endorsement nor a recommendation of those items. Furthermore, the use of such terms is intended to be for educational and informational purposes only.
