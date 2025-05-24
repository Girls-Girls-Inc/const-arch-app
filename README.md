# Constitutional Archive App  [![codecov](https://codecov.io/gh/Girls-Girls-Inc/const-arch-app/branch/testing/graph/badge.svg?token=J1DBE6H4OW)](https://codecov.io/gh/Girls-Girls-Inc/const-arch-app)

The Constitutional Archive App is a full-stack web application for managing and querying historical constitutional data. It offers:

- A secure admin portal for uploading and organizing constitutional documents.
- A public-facing search interface that enables users to retrieve documents using natural language queries.

## Installation

### Prerequisites

Ensure the following software is installed:

- [Node.js (version 18 or higher)](https://nodejs.org/)
- npm (Node Package Manager)

### Clone the Repository

```bash
git clone git@github.com:Girls-Girls-Inc/const-arch-app.git
cd const-arch-app
```

### Copy the environment file
Copy `.env`(found in our submission docuementation) - which contains the Service Account Key - into the top level directory.

```
const-arch-app/
├── README.md
├── app.js
├── babel.config.cjs
├── backend
├── coverage
├── firebase-debug.log
├── frontend
├── jest.config.mjs
├── jest.setup.js
├── node_modules
├── .env                  <<<< here
├── package-lock.json
└── package.json
```

### Start the Server

This command installs all required dependencies and starts the server:

```bash
npm run serve
```

You should see the following output:

```yaml
Server Listening on PORT: 4001
```

Then, navigate to the application in your browser:

```
http://localhost:4001
```

### Running a Specific Release

To run a specific tagged version (e.g., `v2.0.0`):

```bash
git checkout tags/v2.0.0 -b local-v2.0.0
npm run serve
```


