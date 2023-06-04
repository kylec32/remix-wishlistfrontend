import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Collapse, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderArgs, json } from "@remix-run/node";
import React from 'react';

import { requireUserId, getUserIdFromSession } from "~/utils/session.server";
import { getUserGifts, getGiftsForRequestedUsers } from "~/utils/gift-service.server";
import { getUsersUserFollows } from "~/utils/following-service.server";

type MyListProps = {
    ideas: any[]
}

export const loader = async ({ request }: LoaderArgs) => {
    const userId = await requireUserId(request);
  
    // Following Users  
    const followingUserInfo = await getUsersUserFollows(userId);
  
    // Following User Gifts
    const followingUserIds = followingUserInfo.map(userInfo => userInfo.userId);
  
    const followedUserGifts = await getGiftsForRequestedUsers(followingUserIds, userId);
  
    return json({ requesterGifts: await getUserGifts(userId) });
  };

const MyList = () => {
    const [collapsed, setCollapsed] = React.useState(true)
    const [open, setOpen] = React.useState(false);
    const data = useLoaderData<typeof loader>();

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleCollapsed = () => {
        setCollapsed((prev) => !prev);
    }

    function getDisplay(idea: any) {
        if (idea.link !== undefined) {
            return (<ListItemButton href={idea.link} target='_blank'>
                <ListItemText primary={idea.name} />
            </ListItemButton>)
        } else {
            return (<ListItemText primary={idea.name} />)
        }
    }

    return (
        <span>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Idea</DialogTitle>
                <Form action="/add-item" method='POST' onSubmit={handleClose}>
                    <DialogContent>
                    
                        <TextField
                            autoFocus
                            margin="dense"
                            name="name"
                            id="name"
                            label="Name"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            name="link"
                            id="link"
                            label="Link (Optional)"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button type="reset" onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </DialogActions>
                </Form>
            </Dialog>
            <Card sx={{ minWidth: 275, width: '40%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
                <CardHeader title="My List" action={
                    <span>
                    <a onClick={handleCollapsed}>{collapsed ? 'A' : 'B'}</a>
                    </span>
                } />
                <CardContent>
                    <Collapse in={collapsed}>
                    <List>
                        {data.requesterGifts.map((idea: any) => {
                        return (<ListItem disablePadding key={idea.id} sx={{ paddingBottom: '5px'}}>
                            {getDisplay(idea)}   
                            <br/>
                            <Button onClick={(e) => {}} variant="outlined">Edit</Button>
                            &nbsp;
                            <Button onClick={(e) => {}} variant="outlined">Remove</Button>
                        </ListItem>)
                        })}
                    </List>
                    </Collapse>
                </CardContent>
                <CardActions>
                    <Button onClick={handleClickOpen}>Add Idea</Button>
                </CardActions>
            </Card>
        </span>
    )
}

export default MyList;