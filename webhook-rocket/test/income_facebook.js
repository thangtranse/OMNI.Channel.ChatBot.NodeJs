class Script {

    process_incoming_request({request}) {
        // console is a global helper to improve debug
        console.log("income request: ", request.content);
        return {
            content: {
                text: request.content.text,
                "attachments": [{
                    "color": "#FF0000",
                    "author_name": request.content.userId,
                }]
                // "attachments": [{
                //   "color": "#FF0000",
                //   "author_name": "Rocket.Cat",
                //   "author_link": "https://open.rocket.chat/direct/rocket.cat",
                //   "author_icon": "https://open.rocket.chat/avatar/rocket.cat.jpg",
                //   "title": "Rocket.Chat",
                //   "title_link": "https://rocket.chat",
                //   "text": "Rocket.Chat, the best open source chat",
                //   "fields": [{
                //     "title": "Priority",
                //     "value": "High",
                //     "short": false
                //   }],
                //   "image_url": "https://rocket.chat/images/mockup.png",
                //   "thumb_url": "https://rocket.chat/images/mockup.png"
                // }]
            }
        };

        // return {
        //   error: {
        //     success: false,
        //     message: 'Error example'
        //   }
        // };
    }
}