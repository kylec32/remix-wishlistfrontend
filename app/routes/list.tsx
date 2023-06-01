import type { V2_MetaFunction } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import FollowingList from "~/components/following";
import MyList from "~/components/mylist";
import PersonIdeas from "~/components/personideas";

import stylesUrl from "~/styles/index.css";

import { requireUserId, getUserIdFromSession } from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  console.log('Enforced logged in user:');
  console.log(userId);
  return json({ hello:'stuff' });
};

export default function List() {

    function handleDelete(userId: string) {
        alert('Delete Called: ' + userId)
    }

    function handleFollowerSelection(userId: string) {
        alert('Follower selected: ' + userId);
    }

    function findNewFollower() {

    }
  return (
    <div>
      <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Wish List Sharer
        </Typography>
        <Button color="inherit">Logout</Button>
      </Toolbar>
      </AppBar>
        <PersonIdeas personData={{'name': 'Test User', 'ideas':[{'id': '123', 'name': 'My gift1', 'link': 'http://google.com', 'purchased': 'true'}, {'id': '234', 'name': 'Another Gift'}, {'id': '345', 'name': 'Final Gift', 'purchased': true, 'purchasedByCurrentUser': true}]}}/>
        <MyList ideas={[{'id': '123', 'name': 'My gift1', 'link': 'http://google.com'}, {'id': '234', 'name': 'Another Gift'}]}/>
        <FollowingList findNewFollower={findNewFollower}
                        onFollowerSelected={handleFollowerSelection}
                        onDelete={handleDelete}
                        following={[{'userId': '123', 'displayName':'Followed 1'},{'userId': '234', 'displayName':'Followed 2'},{'userId': '345', 'displayName':'Followed 3'}]}></FollowingList>
      
    </div>
  );
}
