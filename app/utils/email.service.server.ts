const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export async function sendHtmlMessage(to: string, subject: string, htmlBody: string) {
    await sendMessage(
        {
            "Messages":[
              {
                "From": {
                  "Email": "noreply-wishlist@scaledcode.com",
                  "Name": "WishlistSharer"
                },
                "To": [
                  {
                    "Email": to
                  }
                ],
                "Subject": subject,
                "HTMLPart": htmlBody
              }
            ]
          });
}

export async function sendTextMessage(to: string, subject: string, body: string) {
    await sendMessage(
        {
            "Messages":[
              {
                "From": {
                  "Email": "noreply-wishlist@scaledcode.com",
                  "Name": "Wishlist Sharer"
                },
                "To": [
                  {
                    "Email": to
                  }
                ],
                "Subject": subject,
                
                "TextPart": body
              }
            ]
          }
    )
}

async function sendMessage(messageInfo: any) {
    console.log(JSON.stringify(messageInfo));
    let result = await fetch('https://api.mailjet.com/v3.1/send', {method: 'post', headers:{
        'authorization': 'Basic ' + Buffer.from(EMAIL_USER + ":" + EMAIL_PASSWORD).toString('base64')
    }, body: JSON.stringify(messageInfo)});
}