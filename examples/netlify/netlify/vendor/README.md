# Vendored MySQL driver

`mysql.js` is generated with Deno 2.5.6 from `../../deps/mysql.ts` and the
SHA-256 hashes in `../../deno.lock`. It includes mysql v2.12.1 and all its
runtime dependencies, with no remote imports. Do not edit it by hand.

From `examples/netlify`, run `npm run edge:bundle` with Deno 2.5.6 on PATH.
The frozen lockfile rejects changed or newly introduced dependencies.
Review the source URL, lockfile, licenses, and generated diff when updating.
Netlify deploys the committed local bundle; it does not need to download this
driver during bundling or cold starts.

Upstream sources and MIT licenses are recorded in `LICENSES.txt`:

- https://deno.land/x/mysql@v2.12.1/
- https://deno.land/x/sql_builder@v1.9.1/
- https://deno.land/x/bytes_formater@v1.4.0/
- https://deno.land/std@0.104.0/ (also std@0.77.0)
