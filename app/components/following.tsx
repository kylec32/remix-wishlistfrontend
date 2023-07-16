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

import { Form, useNavigation } from "@remix-run/react";

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
    const [searchResults, setSearchResults] = React.useState([]);
    const navigation = useNavigation();

    let controller = new AbortController();
    let signal = controller.signal;

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setSearchCriteria('');
      setSearchResults([]);
    };

    const handleCollapsed = () => {
        setCollapsed((prev) => !prev);
    }

    const updateContent = (event: ChangeEvent<HTMLInputElement>) => {
        // Cancel the previous request, if any
        controller.abort();

        // Create a new controller and signal for the current request
        controller = new AbortController();
        signal = controller.signal;
        const newText = event.target.value;
        setSearchCriteria(newText);

        if (newText === undefined || newText.length === 0) {
            setSearchResults([]);
            return;
        }

        fetch('/user-search?filter=' + event.target.value, { signal })
        .then(response => response.json())
        .then(results => {
            setSearchResults(results)
        });
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
                    {searchResults.map((followingUserSearchResult) => {
                    return (<ListItem disablePadding key={followingUserSearchResult.id} >
                        <Form action="/add-user" method='POST' onSubmit={handleClose}>
                            <input type='hidden' name='userIdToFollow' value={followingUserSearchResult.id}/>
                            {/* <button type='submit'> */}
                            <ListItemButton type="submit" component="button" disabled={navigation.state === "submitting"}>
                                <ListItemText primary={followingUserSearchResult.first_name + ' ' + followingUserSearchResult.last_name}
                                            secondary={followingUserSearchResult.email_address} />
                            </ListItemButton>
                            {/* </button> */}
                        </Form>
                    </ListItem>)
                    })}
                </List>
            </DialogContent>
        </Dialog>
        <Card sx={{ minWidth: 275, width: '40%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
            <CardHeader title="Following" action={
                <span>
                <Button variant="outlined" onClick={handleClickOpen}>New</Button>
                &nbsp;
                <a onClick={handleCollapsed}><img src={collapsed ? 'chevron-up.svg' : 'chevron-down.svg'}/></a>
                </span>
            } />
            <CardContent>
                <Collapse in={collapsed}>
                    { following.length ===0 && 'Wishlist Sharer is more fun when you follow people'}
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