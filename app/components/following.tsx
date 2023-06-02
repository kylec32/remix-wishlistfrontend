import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Collapse, TextField } from '@mui/material';
import Button from '@mui/material/Button';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";

import type { FollowedPerson } from '~/models/followedPerson';
import React from 'react';

type FollowingListProps = {
    onDelete: (userId: string) => void;
    onFollowerSelected: (userId: string) => void;
    findNewFollower: () => void;
    following: FollowedPerson[]
}

const FollowingList: React.FC<FollowingListProps> = ({onDelete, onFollowerSelected, findNewFollower, following}) => {
    const [collapsed, setCollapsed] = React.useState(false)

    const handleCollapsed = () => {
        setCollapsed((prev) => !prev);
    }

    return (
        <Card sx={{ minWidth: 275, width: '40%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
            <CardHeader title="Following" action={
                <span>
                <Form action="/add-user" method='POST'>
                    <input type='hidden' name='userIdToFollow' value='8bf2bbb1-6149-4f9c-b27e-70363def375b'/>
                    <Button variant="outlined" type='submit'>New</Button>
                </Form>
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
                        <Button onClick={(e) => {
                                e.preventDefault(); 
                                onDelete(followingPerson.userId);
                            }} variant="outlined">Disconnect</Button>
                    </ListItem>)
                    })}
                </List>
                </Collapse>
            </CardContent>
        </Card>
    )
}

export default FollowingList;