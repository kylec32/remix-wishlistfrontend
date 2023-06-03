import { db } from '~/utils/db.server';

export async function getUserGifts(userId: string) {
    // Requested Gifts
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

    return requestedGiftsRaw.map(gift => {
    return {
        id: gift.id,
        name: gift.name,
        link: gift.url
    }
    });
}

export async function getGiftsForRequestedUsers(userIds: string[], requestingUserId: string) {
    let followedUserGiftsInfo = await db.wishListItem.findMany({
        where: {
          requestingUserId: {
            in: userIds
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
    
      const groupedData = followedUserGiftsInfo.reduce((acc: { [key: string]: Array<any> }, item) => {
        const requestingUserName = item.requestingUser.first_name + " " + item.requestingUser.last_name;
        if (!acc[requestingUserName]) {
          acc[requestingUserName] = [];
        }
        acc[requestingUserName].push({
          id: item.id,
          name: item.name,
          link: item.url,
          purchased: item.purchasedById != null,
          purchasedByCurrentUser: item.purchasedById != null && item.purchasedById === requestingUserId
        });
        return acc;
      }, {});
    
      return Object.entries(groupedData).map(([name, ideas]) => {
        return { name, ideas };
      });
}