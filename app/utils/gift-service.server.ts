import { db } from '~/utils/db.server';
import { badRequest } from './request.server';

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
    },
    orderBy: {
      createdAt: 'asc'
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
    let idToNameMap = {};
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

      const usersWithPresents = [...new Set(followedUserGiftsInfo.map(followerUserGiftInfo => followerUserGiftInfo.requestingUser.id))];

      const userIdsWithNoPresents = userIds.filter(id => !usersWithPresents.includes(id));

      const presentlessUserInfo = await db.user.findMany({
        where: {
          id: {
            in: userIdsWithNoPresents
          }
        },
        select: {
          first_name: true,
          last_name: true,
          id: true,
        }
      });

      followedUserGiftsInfo.forEach(giftInfo => idToNameMap[giftInfo.requestingUserId] = giftInfo.requestingUser.first_name + " " + giftInfo.requestingUser.last_name);
      presentlessUserInfo.forEach(giftInfo => idToNameMap[giftInfo.id] = giftInfo.first_name + " " + giftInfo.last_name)
    
      const groupedData = followedUserGiftsInfo.reduce((acc: { [key: string]: Array<any> }, item) => {
        // const requestingUserName = item.requestingUser.first_name + " " + item.requestingUser.last_name + "|" + item.requestingUser.id;
        const id = item.requestingUser.id;
        
        if (!acc[id]) {
          acc[id] = [];
        }
        acc[id].push({
          id: item.id,
          name: item.name,
          link: item.url,
          purchased: item.purchasedById != null,
          purchasedByCurrentUser: item.purchasedById != null && item.purchasedById === requestingUserId
        });
        return acc;
      }, {});
    
      const userPresents = Object.entries(groupedData).map(([id, ideas]) => {
        return { id, ideas };
      });

      presentlessUserInfo.forEach(user => userPresents.push({id: user.id, ideas: []}));

      return userPresents.map(giftInfo => {
        return {
          name: idToNameMap[giftInfo.id],
          id: giftInfo.id,
          ideas: giftInfo.ideas
        }
      })

      return userPresents;
}

export async function getPresentById(presentId: string) {
  return await db.wishListItem.findUnique({
    where: {
      id: presentId
    }
  });
}

export async function markPresentAsPurchased(presentId: string, purchaserUserId: string) {
    try {
        const updatedItems =  await db.wishListItem.updateMany({
            where: {
                id: presentId,
                purchasedById: null
            },
            data: {
                purchasedById: purchaserUserId
            }
        });
    
        console.log(`Updated ${updatedItems.count} items`)
        if (updatedItems.count === 0) {
            throw badRequest({message: 'Alread marked as purchased'});
        }
    } catch(error) {
        console.error('Error marking as purchased:', error);
        throw badRequest({message: 'Issue marking as purchased'});
    }
}

export async function unmarkPresentAsPurchased(presentId: string, purchaserUserId: string) {
    try {
        const updatedItems =  await db.wishListItem.updateMany({
            where: {
                id: presentId,
                purchasedById: purchaserUserId
            },
            data: {
                purchasedById: null
            }
        });
    
        console.log(`Updated ${updatedItems.count} items`)
        if (updatedItems.count === 0) {
            throw badRequest({message: 'Alread marked as purchased'});
        }
    } catch(error) {
        console.error('Error marking as purchased:', error);
        throw badRequest({message: 'Issue marking as purchased'});
    }
}

export async function updatePresent(presentId: string, requesterId: string, name: string, link: string) {
  try {
    const updatedItems =  await db.wishListItem.updateMany({
        where: {
            id: presentId,
            requestingUserId: requesterId
        },
        data: {
            name: name,
            url: link
        }
    });

    console.log(`Updated ${updatedItems.count} items`)
    if (updatedItems.count === 0) {
        throw badRequest({message: 'Alread marked as purchased'});
    }
  } catch(error) {
      console.error('Error marking as purchased:', error);
      throw badRequest({message: 'Issue marking as purchased'});
  }
}

export async function getPurchaserUserInfo(presentId: string) {
  try {
    const presentInfo = await db.wishListItem.findUnique({
      where: {
        id: presentId
      }
    });

    console.log('Present Info')
    console.log(presentInfo);

    if (presentInfo?.purchasedById != undefined) {
      const purchaserInfo = await db.user.findUnique({
        where: {
          id: presentInfo.purchasedById
        }
      });

      console.log('Purchaser Info')
      console.log(purchaserInfo)

      return purchaserInfo;
    } else {
      return undefined;
    }
  } catch(error) {
    return undefined
  }
}

export async function getRequesterInfo(presentId: string) {
  try {
    const presentInfo = await db.wishListItem.findUnique({
      where: {
        id: presentId
      }
    });

    return await db.user.findUnique({
      where: {
        id: presentInfo?.requestingUserId
      }
    });
  } catch(error) {
    console.error('Experienced error trying to retrieve requester info')
    return undefined;
  }
}

export async function deletePresent(presentId: string, requesterId: string) {
  try {
    const updatedItems =  await db.wishListItem.deleteMany({
        where: {
            id: presentId,
            requestingUserId: requesterId
        }
    });

    console.log(`Deleted ${updatedItems.count} items`)
    if (updatedItems.count === 0) {
        throw badRequest({message: 'Alread marked as purchased'});
    }
  } catch(error) {
      console.error('Error marking as purchased:', error);
      throw badRequest({message: 'Issue marking as purchased'});
  }
}