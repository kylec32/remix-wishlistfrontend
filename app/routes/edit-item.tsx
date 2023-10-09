import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";

import { updatePresent } from '~/utils/gift-service.server';
import { badRequest } from "~/utils/request.server";

export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();
    const presentId = form.get('presentId');
    const name = form.get('name');
    const link = form.get('link');
    const requestUserId = await requireUserId(request);

    if (presentId === null) {
        throw badRequest({message: 'Missing present id'});
    }

    await updatePresent(presentId, requestUserId, name, link);

    return redirect('/list');
  };
