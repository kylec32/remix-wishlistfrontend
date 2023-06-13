import { json } from "@remix-run/node";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { badRequest } from "~/utils/request.server";

import { searchForUser } from '~/utils/user-service.server';
import invariant from "tiny-invariant";

export async function loader({ request }: LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const filter = searchParams.get('filter');
  if (filter !== null) {
    return new Response(JSON.stringify(await searchForUser(filter)), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    throw badRequest({'message': 'no filter found'});
  }
}
