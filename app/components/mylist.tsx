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

import { Form } from "@remix-run/react";
import React from 'react';

type MyListProps = {
    ideas: any[]
}

const MyList: React.FC<MyListProps> = ({ideas}) => {
    const [collapsed, setCollapsed] = React.useState(true)
    const [open, setOpen] = React.useState(false);
    const [editMode, setEditMode ] = React.useState(false);
    const [presentId, setPresentId ] = React.useState('');
    const [presentName, setPresentName ] = React.useState('');
    const [presentLink, setPresentLink ] = React.useState('');

    const handleOpenForNew = () => {
      setOpen(true);
      setEditMode(false);
    };

    const handleOpenForEdit = (idea: any) => {
        setOpen(true);
        setEditMode(true);
        setPresentId(idea.id);
        setPresentName(idea.name);
        setPresentLink(idea.link);
    }
  
    const handleClose = () => {
      setOpen(false);
      setPresentId('');
      setPresentName('');
      setPresentLink('');
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
                <Form action={editMode ? "/edit-item" : "/add-item"} method='POST' onSubmit={handleClose}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="name"
                            id="name"
                            label="Name"
                            value={presentName}
                            fullWidth
                            variant="standard"
                            onChange={e => setPresentName(e.target.value)}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            name="link"
                            id="link"
                            label="Link (Optional)"
                            fullWidth
                            value={presentLink}
                            variant="standard"
                            onChange={e => setPresentLink(e.target.value)}
                        />
                        <input name="presentId" type="hidden" value={presentId} />
                    </DialogContent>
                    <DialogActions>
                        <Button type="reset" onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </DialogActions>
                </Form>
            </Dialog>
            <Card sx={{ minWidth: 275, width: '95%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
                <CardHeader title="My List" action={
                    <span>
                    <a onClick={handleCollapsed}><img src={collapsed ? 'chevron-up.svg' : 'chevron-down.svg'}/></a>
                    </span>
                } />
                <CardContent>
                    <Collapse in={collapsed}>
                        {ideas.length === 0 && 'Add your first idea!'}
                    <List>
                        {ideas.map((idea: any) => {
                        return (<ListItem disablePadding key={idea.id} sx={{ paddingBottom: '5px'}}>
                            {getDisplay(idea)}   
                            <br/>
                            <Button onClick={(e) => handleOpenForEdit(idea)} variant="outlined">Edit</Button>
                            &nbsp;
                            <Form action='/delete-item' method='POST'>
                                <input type='hidden' name='presentId' value={idea.id}/>
                                <Button type="submit" variant="outlined">Remove</Button>
                            </Form>
                        </ListItem>)
                        })}
                    </List>
                    </Collapse>
                </CardContent>
                <CardActions>
                    <Button onClick={handleOpenForNew}>Add Idea</Button>
                </CardActions>
            </Card>
        </span>
    )
}

export default MyList;