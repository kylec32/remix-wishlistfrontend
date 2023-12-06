import type { MetaFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: MetaFunction = () => {
  return [{ title: "Wishlist Sharer" }];
};

export default function TestPage() {
  return (
    <h1>Hello</h1>
  
  );
}
