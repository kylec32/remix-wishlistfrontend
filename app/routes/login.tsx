import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import type { LinksFunction } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { useNavigation, Form } from "@remix-run/react";
import { useSearchParams,  useActionData, Link } from '@remix-run/react';

import { login, createUserSession } from '~/utils/session.server';
import { badRequest } from '~/utils/request.server';

import React, { ChangeEvent } from 'react';

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");
    const redirectTo = '/list'

    if (
        typeof password !== "string" ||
        typeof username !== "string"
      ) {
        return badRequest({
            invalidCredentials: true,
          });
      }

    const userData = await login({ username, password });

    console.log(userData);
    if (userData === null) {
        return badRequest({
            invalidCredentials: true,
          });
    } else {
        return createUserSession(userData.id, '/list');
    }
  };

export default function Login() {
    const actionData = useActionData<typeof action>();
    const [searchParams] = useSearchParams();
    const [emailAddress, setEmailAddress] = React.useState('');
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState<AlertColor>('success');
    const navigation = useNavigation();

    function forgottenPassword() {
      if (emailAddress.length == 0) {
        openAlert('Please enter an email address which you would like to send the forgotten password email to.', 'error');
        return;
      }
      fetch('/forgotten-password-send', {
        method: 'post',
        body: JSON.stringify({'email_address': emailAddress})
      }).then(response => openAlert('Forgotten password link has been sent to ' + emailAddress + ' if it is a registered email address.', 'success'));
    }

    function updateEmail(event: ChangeEvent<HTMLInputElement>) {
      const newEmailAddress = event.target.value;
      setEmailAddress(newEmailAddress);
    }

    function openAlert(message: string, severity: AlertColor) {
      setAlertMessage(message);
      setAlertSeverity(severity);
      setAlertOpen(true);
    }

    function alertClose() {
      setAlertOpen(false);
    }

    return (
      <div>
      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={alertClose} anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}>
        <Alert severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
        <Form method="post">
        <Card sx={{ minWidth: 275, width: '40%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
            <CardHeader title="Login" />
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
                <TextField id="standard-basic" name='username' label="Email Address" variant="standard" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}} value={emailAddress} onChange={updateEmail}/><br/><br/>
                <TextField id="standard-basic" name='password' label="Password" variant="standard" type="password" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/>
                
                <a onClick={forgottenPassword} style={{cursor: 'pointer'}}><i>Forgotten password</i></a>
                
                <div style={{marginTop: '25px'}}>
                    <Button variant="contained" sx={{marginRight: '10px'}} type='submit' disabled={navigation.state === "loading"}>Login</Button>
                    <Link to={'/signup'}>
                      <Button variant="outlined">Sign Up</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
        </Form>
        </div>
    )
}