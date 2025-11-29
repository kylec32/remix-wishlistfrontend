import { redirect, V2_MetaFunction } from "react-router";
import type { LinksFunction, ActionArgs } from "react-router";
import { requireUserId } from "~/utils/session.server";
import { getUsersFollowers, getUserById } from "~/utils/user-service.server";
import { db } from '~/utils/db.server';
import { sendHtmlMessage } from '~/utils/email.service.server';

import stylesUrl from "~/styles/index.css?url";

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

    const followerInfo = await getUsersFollowers(requestUserId);
    const requesterInfo = await getUserById(requestUserId);

    let presentLink = '';
    if (link !== undefined && link.length > 0) {
        presentLink = `<a href="${link}">${name}</a>`
    } else {
        presentLink = name;
    }

    for (let follower of followerInfo) {
      console.log(`Notifying ${follower.email_address}`);

      sendHtmlMessage(follower.email_address, 'New Wish List Item for Person You Follow', `
      ${requesterInfo?.first_name} ${requesterInfo?.last_name} just added a new gift to their list!
      <br/>
      <br/>
      New Item: ${presentLink}
        `);
    }

    return redirect('/list');
  };

export default function TestPage() {
  return (
    <h1></h1>
  );
}
