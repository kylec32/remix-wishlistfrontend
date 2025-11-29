import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { requireUserId } from "~/utils/session.server";

import { updatePresent, getRequesterInfo, getPurchaserUserInfo } from '~/utils/gift-service.server';
import { sendHtmlMessage } from '~/utils/email.service.server';
import { badRequest } from "~/utils/request.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const form = await request.formData();
    const presentId = form.get('presentId');
    const name = form.get('name');
    const link = form.get('link');
    const requestUserId = await requireUserId(request);

    if (presentId === null) {
        throw badRequest({message: 'Missing present id'});
    }

    await updatePresent(presentId, requestUserId, name, link);

    const purchaserInfo = await getPurchaserUserInfo(presentId);

    if (purchaserInfo != undefined) {
        const purchasedForUser = await getRequesterInfo(presentId);
        let presentLink = '';
        if (link !== undefined && link.length > 0) {
            presentLink = `<a href="${link}">${name}</a>`
        } else {
            presentLink = name;
        }

        sendHtmlMessage(purchaserInfo.email_address, 'Purchased Present Changed', `
        A gift that you purchased for ${purchasedForUser?.first_name} ${purchasedForUser?.last_name} has had it's information changed.
                <br/>
                <br/>
                New Present: ${presentLink}
        `)
    }

    return redirect('/list');
  };
