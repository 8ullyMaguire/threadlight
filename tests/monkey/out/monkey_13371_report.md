# Polaris Monkey Test Report

- Seed: 13371
- Target: http://localhost:5173
- Actions: 120
- Error events: 3
- Console warnings/errors: 1
- Timestamp: 2026-07-17T19:16:35.805Z

## Summary

**Issue Categorization:**
*   **CRITICAL**: Page crash / Broken navigation. The application failed to render `Footer.svelte` due to an internal server error, likely causing the SPA shell or routing logic to break.
    *   *Evidence*: `[5XX] 500 GET ... Footer.svelte`, `[REQFAIL] ... ERR_ABORTED`.

**Developer Summary:**
*   **Root Cause**: A fatal runtime exception occurred in `src/lib/components/Footer.svelte` (or its imports), triggering a Go/Gin server-side crash. The frontend cannot load the footer, breaking navigation and likely rendering.
*   **Action Item**: Inspect the backend logs for stack traces corresponding to the timestamp of this request. Check if `Footer.svelte` references missing data sources or has unhandled errors in its `$bindable()` logic that caused a panic/recovery failure on the Go side.

## Raw events (4 unique)

- [AUTH] could not authenticate monkey user (email monkey@polaris.test)
- [5XX] 500 GET http://localhost:5173/src/lib/components/Footer.svelte
- [REQFAIL] http://localhost:5173/src/lib/components/Footer.svelte :: net::ERR_ABORTED
- [CONSOLE error] Failed to load resource: the server responded with a status of 500 (Internal Server Error)
