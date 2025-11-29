import { MetaFunction } from "react-router";
import type { LinksFunction, ActionFunctionArgs } from "react-router";
import { json } from "react-router";
import { requireUserId } from "~/utils/session.server";
import { db } from '~/utils/db.server';

import stylesUrl from "~/styles/index.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: MetaFunction = () => {
  return [{ title: "Wishlist Sharer" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
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
