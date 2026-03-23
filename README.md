# CodeRunr IDE

`Disclaimer:` This project is completely build using vibe coding.

## Environment

Create a `.env` file based on `.env.example`.

```bash
VITE_API_BASE_URL=/api/v1
CODE_RUN_API_BASE_URL=https://example.com/api/v1
CODE_RUN_API_KEY=your-secret-key
PORT=8787
```

`CODE_RUN_API_KEY` must only be set on the server.

## Local Development

Run the frontend:

```bash
vite
```

During development, Vite reads `CODE_RUN_API_BASE_URL` and `CODE_RUN_API_KEY` from your environment and forwards `/api/v1` requests to the upstream code runner with `X-API-KEY` attached server-side. The browser still only talks to `/api/v1`.

## Production

Use the Node proxy in [server/server.js](/c:/Users/akash/OneDrive/Desktop/product_project/CodeRunr-IDE/server/server.js) or an equivalent backend/reverse proxy in production so the browser never calls the upstream Code Run API directly.
