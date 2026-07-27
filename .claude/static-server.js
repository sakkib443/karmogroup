// Minimal static file server for the reference site under recource/.
//
// Written because `npx live-server` fails to launch on this machine — the
// resolved npx path contains a space ("C:\Program Files\...") and the runner
// does not quote it. Node runs directly, so this side-steps that entirely.
//
// Streams every response and honours Range requests, so the 160–200 MB TVC
// videos in the reference folder seek and play instead of being buffered whole
// into memory.
//
//   node .claude/static-server.js "<root dir>" <port>

const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(process.argv[2] || ".");

// PORT first, so the runner can hand this server a free port when 5501 is
// already taken — nothing here needs a fixed port, there are no callbacks or
// CORS origins pointing at it. The argument and the 5501 default stay for
// running it by hand.
const port = Number(process.env.PORT) || Number(process.argv[3]) || 5501;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".pdf": "application/pdf",
};

const server = http.createServer((req, res) => {
  // Strip the query string, decode %20 etc., and drop any ".." so a request
  // can never climb out of the served root.
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400).end("Bad request");
    return;
  }

  const safe = path
    .normalize(pathname)
    .replace(/^(\.\.[/\\])+/, "")
    .replace(/^[/\\]+/, "");
  let filePath = path.join(root, safe);

  if (!filePath.startsWith(root)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    fs.stat(filePath, (err2, stat2) => {
      if (err2 || !stat2.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
        return;
      }

      const type = MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
      const range = req.headers.range;

      // Range request — return just the asked-for slice so video can seek.
      if (range) {
        const match = /bytes=(\d*)-(\d*)/.exec(range);
        if (match) {
          const start = match[1] ? parseInt(match[1], 10) : 0;
          const end = match[2] ? parseInt(match[2], 10) : stat2.size - 1;
          if (start > end || end >= stat2.size) {
            res.writeHead(416, { "Content-Range": `bytes */${stat2.size}` }).end();
            return;
          }
          res.writeHead(206, {
            "Content-Type": type,
            "Content-Range": `bytes ${start}-${end}/${stat2.size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": end - start + 1,
          });
          fs.createReadStream(filePath, { start, end }).pipe(res);
          return;
        }
      }

      res.writeHead(200, {
        "Content-Type": type,
        "Content-Length": stat2.size,
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-cache",
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });
});

server.listen(port, () => {
  console.log(`Reference site on http://localhost:${port}  (root: ${root})`);
});
