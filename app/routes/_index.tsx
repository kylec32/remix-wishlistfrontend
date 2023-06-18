import type { V2_MetaFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  return (
<div style={{textAlign: "center"}}>
  <h1 style={{fontFamily: "'Roboto', sans-serif", backgroundColor: "black", color: "whitesmoke", marginTop: "0px"}}>Wish List Sharer</h1>
  <br/>
  <div style={{fontStyle: "italic"}}>
    <h3>No more ruined surprises or duplicate gifts!</h3>
  </div>
  <br/>
  <br/>
  <div style={{display: "grid", gridGap: "15px", gridTemplateColumns: "1fr 3fr", marginLeft: "15px", marginRight: "15px"}}>
    <div style={{gridColumnStart: "1", gridRowStart: "1"}}>
      <i className="fas fa-6x fa-gift"></i>
    </div>
    <div style={{gridColumnStart: "2", gridRowStart: "1", marginTop: "auto", marginBottom: "auto"}}>
      Whether it's a birthday, Christmas, graduation, wedding, or something else, there are many occasions where gifts are given. For various reasons, those giving the gifts may not know what the person asking for gifts may want or need. Wish lists and registries provide a method of sharing these needs however they often require the gifts to be on the hosting website and ruin the surprise in that those setting up the list can see what has been purchased.
    </div>
    <br/>
    <br/>
    <div style={{gridColumnStart: "1", gridRowStart: "2"}}>
      <i className="fas fa-6x fa-clipboard-list"></i>
    </div>
    <div style={{gridColumnStart: "2", gridRowStart: "2", marginTop: "auto", marginBottom: "auto"}}>
      This website is different. Simply set up an account, add your presents, and let people know where they can see the list of present ideas. Others can mark presents as purchased but you will not see which gifts are purchased and which are not. No more duplicate gifts, stressed out family, or presents that you have no use of.
    </div>
    <br/>
    <br/>
    <div style={{gridColumn: "1/-1", gridRowStart: "3"}}>
      <b>Let's get started!</b>
      <br/>
      <br/>
      <Link to='/signup'>
        <button mat-raised-button="true" >Sign Up</button>
      </Link>
      <br/>
      <br/>
      <Link to='/login' className="text-blue-600 underline">
          Login
      </Link>
    </div>
  </div>
</div>
  
  );
}
