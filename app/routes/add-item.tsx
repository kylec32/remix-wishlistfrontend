import { redirect, V2_MetaFunction } from "@remix-run/node";
import type { LinksFunction, ActionArgs } from "@remix-run/node";
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
    const form = await request.formData();
    const name = form.get('name')
    const link = form.get('link')
    const requestUserId = await requireUserId(request);

    console.log(form)
    console.log(name)
    console.log(link)

    await db.wishListItem.create({
        data: {
            name: name,
            url: link,
            requestingUserId: requestUserId
        }
    });

    return redirect('/list');
  };

export default function TestPage() {
  return (
    <h1></h1>
  );
}
