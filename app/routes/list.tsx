import type { V2_MetaFunction } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import FollowingList from "~/components/following";
import MyList from "~/components/mylist";
import PersonIdeas from "~/components/personideas";

import stylesUrl from "~/styles/index.css";

import { requireUserId } from "~/utils/session.server";
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
  const navigation = useNavigation();
  const data = useLoaderData<typeof loader>();

    function handleFollowerSelection(userId: string) {
        document.getElementById(userId + '-list')?.scrollIntoView();
    }

  return (
    <div>
      
      <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Wish List Sharer
            {
              (navigation.state === 'submitting' || navigation.state === 'loading') &&
                <LinearProgress color="inherit" />
            }
            {
              (navigation.state != 'submitting' && navigation.state != 'loading') &&
                <div style={{lineHeight: 4 + 'px'}}>&nbsp;</div>
            }
            
        </Typography> 
        <Form action="/logout" method="post">
          <Button type="submit" color="inherit">Logout</Button>
        </Form>
      </Toolbar>
      </AppBar>
      <div className="wrapper">
        <MyList ideas={data.requesterGifts}/>
        <FollowingList onFollowerSelected={handleFollowerSelection}
                          following={data.followingUserInfo}></FollowingList>
        
        {data.followedUserGifts
              .map((followedUserInfo: any) => {
                    return (<PersonIdeas key={followedUserInfo.name} personData={followedUserInfo}/>)
        })}
        
        
      </div>
      
    </div>
  );
}
