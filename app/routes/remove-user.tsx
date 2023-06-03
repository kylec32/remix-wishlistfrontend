import { redirect, V2_MetaFunction } from "@remix-run/node";
import type { LinksFunction, ActionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";
import { db } from '~/utils/db.server';

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();
    const userIdToRemove = form.get('userIdToRemove')
    const requestUserId = await requireUserId(request);

    console.log(userIdToRemove)

    await db.follows.deleteMany({
        where: {
            followerId: requestUserId,
            followingId: userIdToRemove
        }
    });

    return redirect('/list');
  };

export default function TestPage() {
  return (
    <span></span>
  );
}
