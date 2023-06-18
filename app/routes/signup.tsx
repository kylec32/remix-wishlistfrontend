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

import stylesUrl from "~/styles/index.css";
import React, { ChangeEvent } from 'react';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();

    console.log(form)
    console.log(form.get('client_response'))
    console.log(form.get('first_name'))
    console.log(process.env["HCAPTCHA_SECRET"])

    console.log(`response=${form.get("client_response")}&secret=${process.env["HCAPTCHA_SECRET"]}`);

    const response = await fetch('https://hcaptcha.com/siteverify',
    {method: 'POST', headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    body: `response=${form.get("client_response")}&secret=${process.env["HCAPTCHA_SECRET"]}`});
    // body: `response=${form.get("clientResponse")}&secret=0x0000000000000000000000000000000000000000`});

    const responseJson = await response.json();
    console.log(responseJson)
    // console.log(response)
    

    // const form = await request.formData();
    // const username = form.get("username");
    // const password = form.get("password");
    // const redirectTo = '/list'

    // if (
    //     typeof password !== "string" ||
    //     typeof username !== "string"
    //   ) {
    //     return badRequest({
    //         invalidCredentials: true,
    //       });
    //   }

    // const userData = await login({ username, password });

    // console.log(userData);
    // if (userData === null) {
    //     return badRequest({
    //         invalidCredentials: true,
    //       });
    // } else {
    //     return createUserSession(userData.id, '/list');
    // }
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
    // const [isSubmitable, setIsSubmitable] = React.useState(false);

    function handleVerificationSuccess(token: string) {
        setClientResponse(token);
    }

    function isSubmitable() {
        return firstName.length > 0 && lastName.length > 0 && email.length > 0 && password.length > 0 && password === confirmPassword;
    }

    return (
        <form method="post">
        <Card sx={{ minWidth: 275, width: '40%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
            <CardHeader title="Sign Up" />
            <CardContent>
            { actionData?.invalidCredentials ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                
            Invalid email and/or password
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
                <TextField id="standard-basic" name='first_name' value={firstName} onChange={(event) => setFirstName(event.target.value)} label="First Name" variant="standard" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/><br/>
                <TextField id="standard-basic" name='last_name' value={lastName} onChange={(event) => setLastName(event.target.value)} label="Last Name" variant="standard" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/><br/>
                <TextField id="standard-basic" name='email_address' value={email} onChange={(event) => setEmail(event.target.value)} label="Email Address" variant="standard" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/><br/>
                <TextField id="standard-basic" name='password' value={password} onChange={(event) => setPassword(event.target.value)} label="Password" variant="standard" type="password" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/><br/>
                <TextField id="standard-basic" name='confirm_password' value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} label="Confirm Password" variant="standard" type="password" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/><br/>
                {
                    password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword &&
                    <div>
                        Passwords don't match
                    </div>
                }
                <HCaptcha
                sitekey="02e7de08-73fc-4463-a9ce-ea7e0371f043"
                onVerify={(token,ekey) => handleVerificationSuccess(token)}
                />
                <div style={{marginTop: '25px'}}>
                    <Button variant="outlined" sx={{marginRight: '10px'}}>Back to Login</Button>
                    <Button variant="contained" type='submit' disabled={!isSubmitable()}>Sign Up</Button>
                </div>
            </CardContent>
        </Card>
        </form>
    )
}