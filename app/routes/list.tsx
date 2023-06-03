import type { V2_MetaFunction } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { useSubmit, useTransition } from "@remix-run/react";
import FollowingList from "~/components/following";
import MyList from "~/components/mylist";
import PersonIdeas from "~/components/personideas";

import stylesUrl from "~/styles/index.css";
import { db } from '~/utils/db.server';

import { requireUserId, getUserIdFromSession } from "~/utils/session.server";
import { getUserGifts, getGiftsForRequestedUsers } from "~/utils/gift-service.server";
import { getUsersUserFollows } from "~/utils/following-service.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  // Following Users  
  const followingUserInfo = await getUsersUserFollows(userId);

  // Following User Gifts
  const followingUserIds = followingUserInfo.map(userInfo => userInfo.userId);

  const followedUserGifts = await getGiftsForRequestedUsers(followingUserIds, userId);

  return json({ followingUserInfo, requesterGifts: await getUserGifts(userId), followedUserGifts });
};

export default function List() {
  const data = useLoaderData<typeof loader>();
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
        {data.followedUserGifts
              .map((followedUserInfo: any) => {
                    return (<PersonIdeas key={followedUserInfo.name} personData={followedUserInfo}/>)
        })}
        <PersonIdeas personData={{'name': 'Test User', 'ideas':[{'id': '123', 'name': 'My gift1', 'link': 'http://google.com', 'purchased': 'true'}, {'id': '234', 'name': 'Another Gift'}, {'id': '345', 'name': 'Final Gift', 'purchased': true, 'purchasedByCurrentUser': true}]}}/>
        <MyList ideas={data.requesterGifts}/>
        <FollowingList findNewFollower={findNewFollower}
                        onFollowerSelected={handleFollowerSelection}
                        onDelete={handleDelete}
                        following={data.followingUserInfo}></FollowingList>
      
    </div>
  );
}
