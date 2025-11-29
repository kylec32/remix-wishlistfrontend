import type { ActionFunctionArgs } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import type { LinksFunction } from "react-router";
import { CardHeader, Card, CardContent, TextField, Button } from '@mui/material';

import { useLoaderData } from "react-router"
import { json } from "react-router";
import { redirect } from "react-router";

import * as jose from 'jose'
import React from 'react';
import { badRequest } from '~/utils/request.server';
import { login, createUserSession } from '~/utils/session.server';
import { updateUserPassword } from '~/utils/user-service.server';

import stylesUrl from "~/styles/index.css?url";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const password = form.get("password");
  const confirmPassword = form.get("confirmPassword");
  const token = form.get("token");
  const email = form.get("email");

  const secret = new TextEncoder().encode(
    process.env['JWT_PASSWORD']
  )

  const { payload } = await jose.jwtVerify(token, secret);
  if (payload.sub !== email) {
    return badRequest({
      tokenDidntMatch: true,
    });
  }

  await updateUserPassword(email, password);

  const userData = await login({ username: email, password });

  console.log('Logged in')
  console.log(userData);
  if (userData === null) {
      return badRequest({
          invalidCredentials: true,
        });
  } else {
      return createUserSession(userData.id, '/list');
  }
};

export async function loader({ request, params }: LoaderFunctionArgs) {
    console.log('Args');
    console.log(params);
    
   try {
    const secret = new TextEncoder().encode(
      process.env['JWT_PASSWORD']
    )

    const { payload } = await jose.jwtVerify(params.token, secret);

    if (payload.emailAddress !== params.email) {
        redirect('/list?error=fpNonMatchingEmail')
    }

    console.log(payload)

   } catch(ex) {
    redirect('/list?error=fpIssueValidatingToken')
   }


    return json({token: params.token, email: params.email});
  }

export default function TestPage() {
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const data = useLoaderData<typeof loader>();

  function isSubmitable() {
    return password.length > 0 && password === confirmPassword;
  }

  return (
    <form method="post">
    <Card sx={{ minWidth: 275, width: '40%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
        <CardHeader title="Reset Password" />
        <CardContent>
            <input type="hidden" value={data.token} name="token"/>
            <input type="hidden" value={data.email} name="email"/>
            <TextField id="password" value={password} onChange={(event) => setPassword(event.target.value)} name='password'  label="Password" variant="standard" type="password" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/><br/>
            <TextField id="confirm-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} name='confirm_password'  label="Confirm Password" variant="standard" type="password" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/><br/>
            {
                    password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword &&
                    <div style={{fontSize: 12 + 'px', color: 'red'}}>
                        Passwords don't match
                        <br/>
                        <br/>
                    </div>
                }
            <div style={{marginTop: '25px'}}>
                <Button variant="outlined" sx={{marginRight: '10px'}}>Back to Login</Button>
                <Button variant="contained" type='submit' disabled={!isSubmitable()}>Reset</Button>
            </div>
        </CardContent>
    </Card>
    </form>
);
  }