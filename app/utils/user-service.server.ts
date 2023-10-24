import { db } from '~/utils/db.server';
import bcrypt from "bcryptjs";
import { badRequest } from './request.server';

export async function createUser(firstName: string, lastName: string, emailAdress: string, password: string) {
  const passwordHash = await bcrypt.hash(`${emailAdress.toLowerCase()}_${password}`, 10);

  try {
    const userCreationResult = await db.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email_address: emailAdress,
        password_hash: passwordHash
      }
    });
  
    return userCreationResult.id
  } catch(exception) {
    console.error(exception);
    throw badRequest({
      message: 'Issuce occured creating user'
    });
  }
}

export async function updateUserPassword(emailAdress: string, newPassword: string) {
  const passwordHash = await bcrypt.hash(`${emailAdress.toLowerCase()}_${newPassword}`, 10);

  try {
    await db.user.update({
      where: {
        email_address: emailAdress
      }, 
      data: {
        password_hash: passwordHash
      }
    });
  } catch(exception) {
    console.error(exception);
    throw badRequest({
      message: 'Issuce occured resetting password'
    });
  }
}

export async function searchForUser(searchCriteria: string, requestingUserId: string) {
    const followingUsers = await db.follows.findMany({
        where: {
          followerId: requestingUserId
        },
        include: {
          following: {
            select: {
              id: true
            }
          }
        },
      });

    let ignorableIds = followingUsers.map(followingInfo => followingInfo.following.id);
    ignorableIds.push(requestingUserId)

    return await db.user.findMany({
        where: {
            OR: [
                {first_name: { contains: searchCriteria }},
                {last_name: { contains: searchCriteria }},
                {email_address: { contains: searchCriteria }},
            ],
            AND: [
                {id: {notIn: ignorableIds}}
            ]
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email_address: true
        },
    })
}