import {
  createCookieSessionStorage,
  redirect,
} from "react-router";

import { db } from "./db.server";
import bcrypt from "bcryptjs";

type LoginForm = {
    username: string
    password: string
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export async function login({
    password,
    username,
  }: LoginForm) {
    const user = await db.user.findUnique({
        where: { email_address: username },
      });
      if (!user) {
        console.log('No user found');
        return null;
      }

      console.log('User:')
      console.log(user)

      

    const isCorrectPassword = await bcrypt.compare(
      `${username.toLowerCase()}_${password}`,
        user.password_hash
      );
      if (!isCorrectPassword) {
        console.log('Not correct')
        return null;
      }
      console.log('correct')
    
      return { id: user.id, username };
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "wl_cookie",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(
  userId: string,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserIdFromSession(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }
  return userId;
}

export async function requireUserId(request: Request, redirectTo: string  = new URL(request.url).pathname) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}