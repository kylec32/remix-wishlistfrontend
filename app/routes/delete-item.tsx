import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";

import { deletePresent, getRequesterInfo, getPurchaserUserInfo, getPresentById } from '~/utils/gift-service.server';
import { sendHtmlMessage } from '~/utils/email.service.server';
import { badRequest } from "~/utils/request.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const form = await request.formData();
    const presentId = form.get('presentId');
    const requestUserId = await requireUserId(request);

    if (presentId === null) {
        throw badRequest({message: 'Missing present id'});
    }

    const presentInfo = await getPresentById(presentId)
    const purchaserInfo = await getPurchaserUserInfo(presentId);

    if (purchaserInfo != undefined) {
        const purchasedForUser = await getRequesterInfo(presentId);
        
        let presentLink = '';
        if (presentInfo?.url !== undefined) {
            presentLink = `<a href="${presentInfo?.url}">${presentInfo.name}</a>`
        } else {
            presentLink = presentInfo?.name || 'Unknown Present';
        }

        sendHtmlMessage(purchaserInfo.email_address, 'Purchased Present Removed', `
        A gift that you purchased for ${purchasedForUser?.first_name} ${purchasedForUser?.last_name} has been removed from their list.
            <br/>
            <br/>
            Removed Present: ${presentLink}
        `)
    }

    await deletePresent(presentId, requestUserId);

    return redirect('/list');
  };
