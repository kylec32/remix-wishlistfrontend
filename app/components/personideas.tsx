import { Collapse, CardHeader, Card, CardContent, Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Form } from "@remix-run/react";
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
            return (
                <Form method="delete" action="/present-purchased">
                    <input name="presentId" type="hidden" value={idea.id}/>
                    <Button type="submit" variant="outlined">Mark As Not Purchased</Button>
                </Form>)
        } else if (idea.purchased) {
            return (<Button type="submit" variant="outlined" disabled={true}>Already Purchased</Button>)
        } else {
            return (
            <Form method="POST" action="/present-purchased">
                <input name="presentId" type="hidden" value={idea.id}/>
                <Button type="submit" variant="outlined">Mark As Purchased</Button>
            </Form>)
        }
    }

    return (
        <Card sx={{ minWidth: 275, width: '92%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }} className='all-column-width' id={personData.id + '-list'}>
            <CardHeader title={personData.name} action={
                <span>
                <a onClick={handleCollapsed}><img src={collapsed ? 'chevron-up.svg' : 'chevron-down.svg'}/></a>
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
                {
                    personData.ideas.length === 0 &&
                    <div>This person has not shared any presents</div>
                }
                </Collapse>
            </CardContent>
        </Card>
    )
}

export default PersonIdeas;