const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export async function sendHtmlMessage(to: string, subject: string, htmlBody: string) {
    await sendMessage(
        {
            "Messages":[
              {
                "From": {
                  "Email": "noreply@wishlistsharer.tk",
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
                  "Email": "noreply@wishlistsharer.tk",
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
    console.log(result);

    // return new Promise((resolve, reject) => {
    //     request.post('https://api.mailjet.com/v3.1/send', {
    //         'auth': {
    //             'user': '30a23f52f366cf26048627a52171dbc4',
    //             'password': process.env.MAILGUN_API_KEY
    //         },
    //         'body': JSON.stringify(messageInfo)
    //     }, (error: any, response: request.Response, body: any) => {
    //         if(error) {
    //             reject(error);
    //         }

    //         resolve(body);
    //     });
    // });
}