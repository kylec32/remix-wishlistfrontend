import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";
import { db } from '~/utils/db.server';

export const action = async ({ request }: ActionFunctionArgs) => {
    const form = await request.formData();
    const userIdToRemove = form.get('userIdToRemove')
    const requestUserId = await requireUserId(request);

    await db.follows.deleteMany({
        where: {
            followerId: requestUserId,
            followingId: userIdToRemove
        }
    });

    return redirect('/list');
  };
