# MSAL React Demo

This demo uses `@azure/msal-react` with a popup sign-in flow. The React app exchanges the Microsoft Entra access token with the Spring API, then uses the returned server JWT for API calls.

## Configure authentication

1. Register a single-page application in the [Microsoft Entra admin center](https://entra.microsoft.com/).
2. Add `http://localhost:5173` as a redirect URI under **Authentication**.
3. Copy `.env.example` to `.env` and replace the React and Spring API registration values.
4. In the Spring API app registration, expose the `access_as_user` scope and grant the React app permission to it.
5. Set `VITE_BFF_BASE_URL` to the Spring Boot URL and `VITE_API_SCOPE` to the exposed API scope.
6. Start the Spring API from `spring-api` with `mvn spring-boot:run`.
7. Restart Vite with `npm run dev` after changing `.env`.

Never commit `.env`; it is ignored by Vite projects and should contain only local configuration.

## Development

```bash
npm install
npm run dev
```

## ESLint

ESLint is configured in `eslint.config.js` with the recommended JavaScript,
React Hooks, and React Refresh rules.

Run the linter:

```bash
npm run lint
```

Automatically fix supported issues:

```bash
npm run lint:fix
```

Run `npm run lint` before committing changes. Fix remaining reported issues
manually when ESLint cannot safely change them.

## Pre-commit validation

Husky installs a Git pre-commit hook when dependencies are installed. The hook
runs ESLint first and then runs SonarQube with the quality gate enabled. A
commit is blocked if either command fails.

After cloning the repository, run:

```powershell
npm install
$env:SONAR_TOKEN = "your-sonarqube-project-token"
```

The SonarQube server must be running at `http://localhost:9000`. To run the
same checks manually:

```powershell
npm run lint
npm run sonar
```

## SonarQube analysis

Create a project in the SonarQube instance at `http://localhost:9000` with the
key `msal-react-demo`. Generate a project analysis token from **My Account >
Security**, then set it in the shell before running the scan.

PowerShell:

```powershell
$env:SONAR_TOKEN = "your-project-token"
npm install --save-dev sonar-scanner
npm run sonar
```

The scanner reads `sonar-project.properties`, sends the analysis to
`http://localhost:9000`, and analyzes the `src` directory. Do not commit the
token or place it in `.env` files.

## Spring API session flow

`POST /api/auth/exchange` validates the incoming Entra token using the configured issuer, audience, signature, and expiry. The API stores the original token in a server-side session store and returns a short-lived, HMAC-signed server JWT.

Protected requests use that server JWT. A security filter checks its `jti` against the server-side store and also checks both the Entra token expiry and server JWT expiry. The demo store is in memory; use Redis or another shared store for production or multiple backend instances. Set a unique `SERVER_JWT_SECRET_BASE64` outside local development.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
