import { createServer } from "node:http";

const PORT = Number(process.env.PORT || 8787);
const UPSTREAM_API_BASE_URL = (
  process.env.CODE_RUN_API_BASE_URL || "http://172.105.58.24/api/v1"
).replace(/\/$/, "");
const API_KEY = process.env.CODE_RUN_API_KEY;

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

async function readRequestBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

const server = createServer(async (req, res) => {
  if (!req.url || !req.method) {
    sendJson(res, 400, { detail: "Invalid request" });
    return;
  }

  if (!API_KEY) {
    sendJson(res, 500, {
      detail: "Server misconfiguration: CODE_RUN_API_KEY is missing",
    });
    return;
  }

  const requestUrl = new URL(
    req.url,
    `http://${req.headers.host || "127.0.0.1"}`,
  );

  if (!requestUrl.pathname.startsWith("/api/v1/")) {
    sendJson(res, 404, { detail: "Not found" });
    return;
  }

  try {
    const upstreamPath = requestUrl.pathname.replace(/^\/api\/v1/, "");
    const upstreamUrl = `${UPSTREAM_API_BASE_URL}${upstreamPath}${requestUrl.search}`;
    const body =
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await readRequestBody(req);

    const upstreamResponse = await fetch(upstreamUrl, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        "X-API-KEY": API_KEY,
      },
      body,
    });

    const responseBuffer = Buffer.from(await upstreamResponse.arrayBuffer());
    const contentType =
      upstreamResponse.headers.get("content-type") || "application/json";

    res.writeHead(upstreamResponse.status, { "Content-Type": contentType });
    res.end(responseBuffer);
  } catch (error) {
    sendJson(res, 502, {
      detail:
        error instanceof Error
          ? error.message
          : "Failed to reach upstream code runner",
    });
  }
});

server.listen(PORT, () => {
  console.log(
    `CodeRunr proxy listening on http://127.0.0.1:${PORT} -> ${UPSTREAM_API_BASE_URL}`,
  );
});
