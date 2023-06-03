
import { db } from '~/utils/db.server';

export async function getUsersUserFollows(userId: string) {
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
      
      return followingUsers.map(user => {
        return {
          userId: user.following.id,
          displayName: user.following.first_name + ' ' + user.following.last_name
        }
      });
}