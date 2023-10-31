import { redirect, V2_MetaFunction } from "@remix-run/node";
import type { LinksFunction, ActionArgs, LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";
import { markPresentAsPurchased, unmarkPresentAsPurchased, getRequesterInfo, getPresentById } from '~/utils/gift-service.server';
import { getUsersFollowers, getUserById } from "~/utils/user-service.server";
import { sendHtmlMessage } from '~/utils/email.service.server';

import stylesUrl from "~/styles/index.css";
import { badRequest } from "~/utils/request.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();
    const presentId = form.get('presentId')
    const requestUserId = await requireUserId(request);

    console.log(form);
    console.log(presentId);
    console.log(request.method);

    if (presentId === null) {
        throw badRequest({message: 'Please provide a presentId'})
    }

    const presentInfo = await getPresentById(presentId);


    let presentLink = '';
    if (presentInfo?.url !== undefined) {
        presentLink = `<a href="${presentInfo.url}">${presentInfo.name}</a>`
    } else {
        presentLink = presentInfo?.name || '';
    }

    const requesterInfo = await getRequesterInfo(presentId);

    console.log('Requester Info')
    console.log(requesterInfo)

    console.log(`Request User Id: ${requestUserId}`)
    const followerInfo = await getUsersFollowers(requesterInfo?.id || '');

    console.log(followerInfo);

    if (request.method === 'POST') {
        await markPresentAsPurchased(presentId.toString(), requestUserId);

        followerInfo.filter(follower => follower.id != requestUserId)
                    .forEach(follower => {
                      sendHtmlMessage(follower.email_address, "User You Follow Has Had a Present Purchased",
                      `
                      ${requesterInfo?.first_name} ${requesterInfo?.last_name} just had a present purchased from their list!
                      <br/>
                      <br/>
                      Purchased Item: ${presentLink}
                      `)
                    });
    } else if (request.method === 'DELETE') {
        await unmarkPresentAsPurchased(presentId.toString(), requestUserId);

        followerInfo.filter(follower => follower.id != requestUserId)
                    .forEach(follower => {
                      sendHtmlMessage(follower.email_address, "Present of Person You Follow is No Longer Marked as Purchased",
                      `
                      A present that was previously marked as purchased for ${requesterInfo?.first_name} ${requesterInfo?.last_name} is available to be purchased again. The previous purchaser apparently backed out.
                      <br/>
                      <br/>
                      Item: ${presentLink}
                      `)
                    });
    }
    
    return redirect('/list');
  };

  export let loader: LoaderFunction = async () => {
    // Redirect to the desired page
    return redirect('/list');
  };

export default function TestPage() {
  return (
    <h1></h1>
  );
}
