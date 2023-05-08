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

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];



export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");

    console.log(username);
    console.log(password);

    return redirect(`/list`);
  };

export default function Login() {
    return (
        <form method="post">
        <Card sx={{ minWidth: 275, width: '40%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
            <CardHeader title="Login" />
            <CardContent>
                <TextField id="standard-basic" name='username' label="Email Address" variant="standard" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/><br/>
                <TextField id="standard-basic" name='password' label="Password" variant="standard" sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/><br/>
                <div style={{marginTop: '25px'}}>
                    <Button variant="contained" sx={{marginRight: '10px'}} type='submit'>Login</Button>
                    <Button variant="outlined">Sign Up</Button>
                </div>
            </CardContent>
        </Card>
        </form>
    )
}