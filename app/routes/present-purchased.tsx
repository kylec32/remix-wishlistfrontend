import { redirect, V2_MetaFunction } from "@remix-run/node";
import type { LinksFunction, ActionArgs, LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";
import { markPresentAsPurchased, unmarkPresentAsPurchased } from '~/utils/gift-service.server';

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

    if (request.method === 'POST') {
        await markPresentAsPurchased(presentId.toString(), requestUserId);
    } else if (request.method === 'DELETE') {
        await unmarkPresentAsPurchased(presentId.toString(), requestUserId);
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
