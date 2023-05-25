import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    testUsers().map((user) => {
        return db.user.create({ data: user });
    })
  );
}

seed();

function testUsers() {
    return [
        {
            first_name: 'Kyle',
            last_name: 'Carter',
            email_address: 'kylec32@gmail.com',
            password_hash: '$2a$10$0RV66nX7sVMpVtgnOOswqeY9hfZYlG6.0.NpG7Ruboh5o3jfM.ESe'
            
        },
        {
            first_name: 'Kinzlie',
            last_name: 'Carter',
            email_address: 'kinzliecarter@gmail.com',
            password_hash: '$2a$10$8d4uZdMmr1vrWZ3XhzahJeQE74c9KPpOWWB5OLzCK6bVAwox8sp6G'
        }
    ];
}
