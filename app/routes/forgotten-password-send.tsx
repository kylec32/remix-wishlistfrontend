import { json, redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";

import { sendHtmlMessage } from '~/utils/email.service.server';

import { updatePresent } from '~/utils/gift-service.server';
import { badRequest } from "~/utils/request.server";
import * as jose from 'jose'

export const action = async ({ request }: ActionArgs) => {
    const body = await request.json();

    console.log(body);

    const emailAddress = body.email_address;

    const secret = new TextEncoder().encode(
      process.env['JWT_PASSWORD']
    )
    const alg = 'HS256'

    const token = await new jose.SignJWT({})
    .setSubject(emailAddress)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('5h')
    .sign(secret)

    console.log(token);
    
    const resetUrl = `https://wishlistsharer.tk/reset/${emailAddress}/${token}`;

    await sendHtmlMessage(emailAddress,
                          'Forgotten Password: WishListSharer',
                          `A request for a password reset has been made for your account. If you did not make this request there is no action to be taken.<br/><br/>If you did request this reset please follow this link: <a href="${resetUrl}">${resetUrl}</a><br/><br/>This link will expire in 15 minutes.`);

    return json({success: true});
  };