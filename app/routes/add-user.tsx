import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { badRequest } from '~/utils/request.server';
import { requireUserId } from "~/utils/session.server";
import { db } from '~/utils/db.server';

export const action = async ({ request }: ActionFunctionArgs) => {
    const form = await request.formData();
    const userIdToFollow = form.get('userIdToFollow')
    const requestUserId = await requireUserId(request);

    if(userIdToFollow === undefined) {
      throw badRequest({'message': 'Must include user ID to follow'});
    }

    await db.follows.create({
        data: {
            followerId: requestUserId,
            followingId: userIdToFollow
        }
    });

    return redirect('/list');
  };
