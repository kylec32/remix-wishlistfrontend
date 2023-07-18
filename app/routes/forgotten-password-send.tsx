import { json, redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";

import { updatePresent } from '~/utils/gift-service.server';
import { badRequest } from "~/utils/request.server";

export const action = async ({ request }: ActionArgs) => {
    const body = request.body

    console.log(body);

    return json({success: true});
  };