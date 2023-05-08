import type { V2_MetaFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import FollowingList from "~/components/following";
import MyList from "~/components/mylist";
import PersonIdeas from "~/components/personideas";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
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
        <h1>This is list</h1><br/>
        <PersonIdeas personData={{'name': 'Test User', 'ideas':[{'id': '123', 'name': 'My gift1', 'link': 'http://google.com', 'purchased': 'true'}, {'id': '234', 'name': 'Another Gift'}, {'id': '345', 'name': 'Final Gift', 'purchased': true, 'purchasedByCurrentUser': true}]}}/>
        <MyList ideas={[{'id': '123', 'name': 'My gift1', 'link': 'http://google.com'}, {'id': '234', 'name': 'Another Gift'}]}/>
        <FollowingList findNewFollower={findNewFollower}
                        onFollowerSelected={handleFollowerSelection}
                        onDelete={handleDelete}
                        following={[{'userId': '123', 'displayName':'Followed 1'},{'userId': '234', 'displayName':'Followed 2'},{'userId': '345', 'displayName':'Followed 3'}]}></FollowingList>
    </div>
  );
}
