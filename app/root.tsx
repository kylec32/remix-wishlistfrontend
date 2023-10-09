import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches
} from "@remix-run/react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  const matches = useMatches()
  const isOnSignup = matches.find(m => m.pathname.indexOf("/signup") !== -1)
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {/* Look into remix-utils ExternalScripts */}
        {isOnSignup && <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>}
        <LiveReload />
      </body>
    </html>
  );
}
