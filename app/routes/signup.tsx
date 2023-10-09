import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { LinksFunction } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useSearchParams,  useActionData } from '@remix-run/react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

import { db } from '~/utils/db.server';

import { login, createUserSession } from '~/utils/session.server';
import { badRequest } from '~/utils/request.server';
import { createUser } from '~/utils/user-service.server';
import { sendTextMessage } from '~/utils/email.service.server';

import stylesUrl from "~/styles/index.css";
import React, { ChangeEvent, useEffect } from 'react';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

function isNullOrEmpty(value: FormDataEntryValue | null): boolean {
  return value === null || value === undefined || value.length === 0
}

async function isValidCaptcha(captchaValue: FormDataEntryValue | null): Promise<boolean> {
  
  // console.log("Secret value: " + process.env["HCAPTCHA_SECRET"])
  // const response = await fetch('https://hcaptcha.com/siteverify',
  //     {method: 'POST', headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     body: `response=${captchaValue}&secret=${process.env["HCAPTCHA_SECRET"]}`});

  //   const responseJson = await response.json();

  //   console.log(responseJson);

  //   return responseJson.success;
  const formData = new FormData();
  formData.append('secret', process.env["TURNSTILE_SECRET"]);
  formData.append('response', captchaValue?.toString());

  console.log("Send it!")
  const initialResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData, // Pass the FormData object as the request body
  });

  const jsonResponse = await initialResponse.json();


  console.log("Result:");
  console.log(jsonResponse)

  return jsonResponse.success;
}

export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();

    const firstName = form.get('first_name');
    const lastName = form.get('last_name');
    const emailAddress = form.get('email_address');
    const password = form.get('password');
    const confirmPassword = form.get('confirm_password');
    // const clientResponse = form.get("client_response")
    const turnstileResponse = form.get('cf-turnstile-response');

    console.log(firstName)
    console.log(lastName)
    console.log(emailAddress)
    console.log(password)
    console.log(confirmPassword)
    // console.log(clientResponse);
    console.log(turnstileResponse)

    // if (isNullOrEmpty(firstName) || isNullOrEmpty(lastName) || isNullOrEmpty(emailAddress) || isNullOrEmpty(password) || isNullOrEmpty(confirmPassword) || isNullOrEmpty(clientResponse)) {
    //   return badRequest({
    //     missingInfo: true,
    //     incorrectCaptcha: false
    //   });
    // }

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
    const [clientResponse, setClientResponse] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    function handleVerificationSuccess(token: string) {
        setClientResponse(token);
    }

    function isSubmitable() {
        //return firstName.length > 0 && lastName.length > 0 && email.length > 0 && password.length > 0 && password === confirmPassword;
        return true;
    }

    useEffect(() => {
      // Your JavaScript code to execute when the page loads on the client side
      console.log("Page loaded on the client side!");
      turnstile.render('#turnstileElement', {
        sitekey: '0x4AAAAAAALWDmavHg-cZ360',
        callback: function(token) {
            console.log(`Challenge Success ${token}`);
        },
    });
      
      // You can add any other client-side code here
    }, []);

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
                <input type="hidden" name="client_response" value={clientResponse}/>
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

                {/* <HCaptcha
                sitekey="02e7de08-73fc-4463-a9ce-ea7e0371f043"
                onVerify={(token,ekey) => handleVerificationSuccess(token)}
                /> */}
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