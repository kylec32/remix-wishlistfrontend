import { db } from '~/utils/db.server';
import { badRequest } from './request.server';

export async function searchForUser(searchCriteria: string) {
    return await db.user.findMany({
        where: {
            OR: [
                {first_name: { contains: searchCriteria }},
                {last_name: { contains: searchCriteria }},
                {email_address: { contains: searchCriteria }},
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