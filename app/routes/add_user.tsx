import { redirect, V2_MetaFunction } from "@remix-run/node";
import type { LinksFunction, ActionArgs } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { login, createUserSession } from '~/utils/session.server';
import { badRequest } from '~/utils/request.server';
import { json } from "@remix-run/node";
import { requireUserId, getUserIdFromSession } from "~/utils/session.server";
import { db } from '~/utils/db.server';

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const action = async ({ request }: ActionArgs) => {
    const requestBody = await request.json();
    console.log(requestBody);
    const userIdToFollow = requestBody.userToFollow;
    const requestUserId = await requireUserId(request);

    await db.follows.create({
        data: {
            followerId: requestUserId,
            followingId: userIdToFollow
        }
    });

    return json({created: true}, { status: 201 })
  };

export default function TestPage() {
  return (
    <h1>Hello</h1>
  );
}
