import { db } from '~/utils/db.server';

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