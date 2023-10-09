import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";

import { deletePresent } from '~/utils/gift-service.server';
import { badRequest } from "~/utils/request.server";

export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();
    const presentId = form.get('presentId');
    const requestUserId = await requireUserId(request);

    if (presentId === null) {
        throw badRequest({message: 'Missing present id'});
    }

    await deletePresent(presentId, requestUserId);

    return redirect('/list');
  };
