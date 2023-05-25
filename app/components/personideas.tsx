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

import type { FollowedPerson } from '~/models/followedPerson';
import React from 'react';

type MyListProps = {
    personData: any;
}

const PersonIdeas: React.FC<MyListProps> = ({personData}) => {
    const [collapsed, setCollapsed] = React.useState(true)

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

    function getButton(idea: any) {
        if (idea.purchased && idea.purchasedByCurrentUser) {
            return (<Button onClick={(e) => {}} variant="outlined">Mark As Not Purchased</Button>)
        } else if (idea.purchased) {
            return (<Button onClick={(e) => {}} variant="outlined" disabled={true}>Already Purchased</Button>)
        } else {
            return (<Button onClick={(e) => {}} variant="outlined">Mark As Purchased</Button>)
        }
    }

    return (
        <Card sx={{ minWidth: 275, width: '60%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
            <CardHeader title={personData.name} action={
                <span>
                <a onClick={handleCollapsed}>{collapsed ? 'A' : 'B'}</a>
                </span>
            } />
            <CardContent>
                <Collapse in={collapsed}>
                <List>
                    {personData.ideas.map((idea: any) => {
                    return (<ListItem disablePadding key={idea.id} sx={{ paddingBottom: '5px'}}>  
                        {getDisplay(idea)}   
                        <br/>
                        {getButton(idea)}
                        
                    </ListItem>)
                    })}
                </List>
                </Collapse>
            </CardContent>
        </Card>
    )
}

export default PersonIdeas;