# MSAL React Demo

This demo uses `@azure/msal-react` with a popup sign-in flow and the `User.Read` scope.

## Configure authentication

1. Register a single-page application in the [Microsoft Entra admin center](https://entra.microsoft.com/).
2. Add `http://localhost:5173` as a redirect URI under **Authentication**.
3. Copy `.env.example` to `.env` and replace the React and Spring API registration values.
4. In the Spring API app registration, expose the `access_as_user` scope and grant the React app permission to it.
5. Set `VITE_API_BASE_URL` to the Spring Boot URL and `VITE_API_SCOPE` to the exposed API scope.
6. Restart Vite with `npm run dev` after changing `.env`.

Never commit `.env`; it is ignored by Vite projects and should contain only local configuration.

## Development

```bash
npm install
npm run dev
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
