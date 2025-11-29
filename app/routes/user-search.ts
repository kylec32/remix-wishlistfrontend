import type { LoaderFunctionArgs } from "react-router";
import { badRequest } from "~/utils/request.server";

import { searchForUser } from '~/utils/user-service.server';
import { requireUserId } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUserId = await requireUserId(request);
  const searchParams = new URL(request.url).searchParams;
  const filter = searchParams.get('filter');
  if (filter !== null) {
    return new Response(JSON.stringify(await searchForUser(filter, requestUserId)), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    throw badRequest({'message': 'no filter found'});
  }
}
