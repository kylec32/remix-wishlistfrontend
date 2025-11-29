import type { LinksFunction } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { Card, CardContent, CardHeader, TextField, Button } from '@mui/material';
import { useSearchParams,  useActionData } from 'react-router';

import { login, createUserSession } from '~/utils/session.server';
import { badRequest } from '~/utils/request.server';
import { createUser } from '~/utils/user-service.server';
import { sendTextMessage } from '~/utils/email.service.server';

import stylesUrl from "~/styles/index.css?url";
import React, { ChangeEvent, useEffect } from 'react';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

function isNullOrEmpty(value: FormDataEntryValue | null): boolean {
  return value === null || value === undefined || value.length === 0
}

async function isValidCaptcha(captchaValue: FormDataEntryValue | null): Promise<boolean> {
  const formData = new FormData();
  formData.append('secret', process.env["TURNSTILE_SECRET"]);
  formData.append('response', captchaValue?.toString());

  const initialResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  });

  const jsonResponse = await initialResponse.json();

  return jsonResponse.success;
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const form = await request.formData();

    const firstName = form.get('first_name');
    const lastName = form.get('last_name');
    const emailAddress = form.get('email_address');
    const password = form.get('password');
    const confirmPassword = form.get('confirm_password');
    const turnstileResponse = form.get('cf-turnstile-response');

    if (isNullOrEmpty(firstName) || isNullOrEmpty(lastName) || isNullOrEmpty(emailAddress) || isNullOrEmpty(password) || isNullOrEmpty(confirmPassword) || isNullOrEmpty(turnstileResponse)) {
      return badRequest({
        missingInfo: true,
        incorrectCaptcha: false
      });
    }

    if (await isValidCaptcha(turnstileResponse) == false) {
      return badRequest({
        missingInfo:false,
        incorrectCaptcha: true
      });
    }

    const userId = await createUser(firstName?.toString() ?? '', lastName?.toString() ?? '', emailAddress?.toString() ?? '', password?.toString() ?? '');

    await sendTextMessage(emailAddress?.toString() ?? '', 'Welcome to WishList Sharer', 'Welcome to WishListSharer!\n\nBe sure to invite your friends to join as well as a wish list is no fun if no one uses it.');

    return createUserSession(userId, '/list');
  };

export default function Login() {
    const actionData = useActionData<typeof action>();

    const [searchParams] = useSearchParams();
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    function isSubmitable() {
        return firstName.length > 0 && lastName.length > 0 && email.length > 0 && password.length > 0 && password === confirmPassword;
    }

    useEffect(() => {
      tryLoadTurnstile();
    }, []);

    function tryLoadTurnstile() {
      if (turnstile == undefined) {
        console.log('Turnstile was not available');
        setTimeout(tryLoadTurnstile, 250);
      } else {
        turnstile.render('#turnstileElement', {
          sitekey: '0x4AAAAAAALWDmavHg-cZ360',
          callback: function(token) {
              console.log(`Challenge Success ${token}`);
          },
      });
      }
    }

    return (
        <form method="post">
        <Card sx={{ minWidth: 275, width: '40%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
            <CardHeader title="Sign Up" />
            <CardContent>
            { actionData?.missingInfo ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                
                Fields not filled out completely
              </p>
            ) : null}

            { actionData?.incorrectCaptcha ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                
                Captcha Value Is Incorrect
              </p>
            ) : null}
                <input
                    type="hidden"
                    name="redirectTo"
                    value={
                    searchParams.get("redirectTo") ?? undefined
                    }
                />
                <TextField id="first-name" name='first_name' value={firstName} onChange={(event) => setFirstName(event.target.value)} label="First Name" variant="standard" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/><br/>
                <TextField id="last-name" name='last_name' value={lastName} onChange={(event) => setLastName(event.target.value)} label="Last Name" variant="standard" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/><br/>
                <TextField id="email-address" name='email_address' value={email} onChange={(event) => setEmail(event.target.value)} label="Email Address" variant="standard" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/><br/>
                <TextField id="password" name='password' value={password} onChange={(event) => setPassword(event.target.value)} label="Password" variant="standard" type="password" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/><br/>
                <TextField id="confirm-password" name='confirm_password' value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} label="Confirm Password" variant="standard" type="password" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/><br/>
                {
                    password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword &&
                    <div style={{fontSize: 12 + 'px', color: 'red'}}>
                        Passwords don't match
                        <br/>
                        <br/>
                    </div>
                }

                <div id="turnstileElement" className="cf-turnstile" data-sitekey="0x4AAAAAAALWDmavHg-cZ360"></div>
                <div style={{marginTop: '25px'}}>
                    <Button variant="outlined" sx={{marginRight: '10px'}}>Back to Login</Button>
                    <Button variant="contained" type='submit' disabled={!isSubmitable()}>Sign Up</Button>
                </div>
            </CardContent>
        </Card>
        </form>
    )
}