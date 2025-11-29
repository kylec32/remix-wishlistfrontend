import type { MetaFunction } from "react-router";
import type { LinksFunction } from "react-router";
import { Link, Outlet, useLoaderData } from "react-router";

import stylesUrl from "~/styles/index.css?url";

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
