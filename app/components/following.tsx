import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Collapse, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";

import type { FollowedPerson } from '~/models/followedPerson';
import React, { ChangeEvent } from 'react';

type FollowingListProps = {
    onDelete: (userId: string) => void;
    onFollowerSelected: (userId: string) => void;
    findNewFollower: () => void;
    following: FollowedPerson[]
}

const FollowingList: React.FC<FollowingListProps> = ({onDelete, onFollowerSelected, findNewFollower, following}) => {
    const [collapsed, setCollapsed] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [searchCriteria, setSearchCriteria] = React.useState('');

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleCollapsed = () => {
        setCollapsed((prev) => !prev);
    }

    const updateContent = (event: ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value;
        setSearchCriteria(newText);
        console.log(newText)
    }

    return (
        <span>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Follow Someone New</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    id="name"
                    label="Search Criteria"
                    fullWidth
                    variant="standard"
                    value={searchCriteria}
                    onChange={updateContent}
                />
                <List>
                    <ListItem disablePadding>
                        User 1
                    </ListItem>
                    <ListItem disablePadding>
                        User 2
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>
        <Card sx={{ minWidth: 275, width: '40%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
            <CardHeader title="Following" action={
                <span>
                {/* <Form action="/add-user" method='POST' style={{display: 'inline'}}>
                    <input type='hidden' name='userIdToFollow' value='8bf2bbb1-6149-4f9c-b27e-70363def375b'/>
                    <Button variant="outlined" type='submit'>New</Button>
                </Form> */}
                <Button variant="outlined" onClick={handleClickOpen}>New</Button>
                &nbsp;
                <a onClick={handleCollapsed}>{collapsed ? 'A' : 'B'}</a>
                </span>
            } />
            <CardContent>
                <Collapse in={collapsed}>
                <List>
                    {following.map((followingPerson: FollowedPerson) => {
                    return (<ListItem disablePadding key={followingPerson.userId} >
                        <ListItemButton onClick={() => onFollowerSelected(followingPerson.userId)}>
                            <ListItemText primary={followingPerson.displayName} />
                            
                        </ListItemButton>
                        <Form action="/remove-user" method='POST'>
                            <input type="hidden" name="userIdToRemove" value={followingPerson.userId}/>
                            <Button type="submit" variant="outlined">Disconnect</Button>
                        </Form>

                    </ListItem>)
                    })}
                </List>
                </Collapse>
            </CardContent>
        </Card>
        </span>
    )
}

export default FollowingList;