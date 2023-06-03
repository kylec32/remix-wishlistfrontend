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

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  const followingUsers = await db.follows.findMany({
    where: {
      followerId: userId
    },
    include: {
      following: {
        select: {
          id: true,
          first_name: true,
          last_name: true
        }
      }
    },
  });
  
  const followingUserInfo = followingUsers.map(user => {
    return {
      userId: user.following.id,
      displayName: user.following.first_name + ' ' + user.following.last_name
    }
  });


  const followingUserIds = followingUserInfo.map(userInfo => userInfo.userId);

  let followedUserGiftsInfo = await db.wishListItem.findMany({
    where: {
      requestingUserId: {
        in: followingUserIds
      }
    },
    include: {
      requestingUser: {
        select: {
          id: true,
          first_name: true,
          last_name: true
        }
      }
    }
  });

  const groupedData = followedUserGiftsInfo.reduce((acc, item) => {
    const requestingUserName = item.requestingUser.first_name + " " + item.requestingUser.last_name;
    if (!acc[requestingUserName]) {
      acc[requestingUserName] = [];
    }
    acc[requestingUserName].push({
      id: item.id,
      name: item.name,
      link: item.url,
      purchased: item.purchasedById != null,
      purchasedByCurrentUser: item.purchasedById != null && item.purchasedById === userId
    });
    return acc;
  }, {});
  const followedUserGifts = Object.entries(groupedData).map(([name, ideas]) => {
    return { name, ideas };
  });

  console.log(followedUserGiftsInfo);
  console.log(followedUserGifts)
  console.log(groupedData);

  const requestedGiftsRaw = await db.wishListItem.findMany({
    where: {
      requestingUserId: userId
    },
    select: {
      id: true,
      name: true,
      url: true
    }
  });

  const requesterGifts = requestedGiftsRaw.map(gift => {
    return {
      id: gift.id,
      name: gift.name,
      link: gift.url
    }
  });

  return json({ followingUserInfo, requesterGifts, followedUserGifts });
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
