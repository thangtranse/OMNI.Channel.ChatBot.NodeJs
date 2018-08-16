/* exported Script */
/* globals console, _, s, HTTP */

/** Global Helpers
 *
 * console - A normal console instance
 * _       - An underscore instance
 * s       - An underscore string instance
 * HTTP    - The Meteor HTTP object to do sync http calls
 */

class Script {
    /**
     * @params {object} request
     */
    prepare_outgoing_request({ request }) {
        // request.params            {object}
        // request.method            {string}
        // request.url               {string}
        // request.auth              {string}
        // request.headers           {object}
        // request.data.token        {string}
        // request.data.channel_id   {string}
        // request.data.channel_name {string}
        // request.data.timestamp    {date}
        // request.data.user_id      {string}
        // request.data.user_name    {string}
        // request.data.text         {string}
        // request.data.trigger_word {string}

        let match;

        // Change the URL and method of the request
        match = request.data.text.match(/^pr\s(ls|list)/);
        if (match) {
            return {
                url: request.url + '/pulls',
                headers: request.headers,
                method: 'GET'
            };
        }

        // Prevent the request and return a new message
        match = request.data.text.match(/^help$/);
        if (match) {
            return {
                message: {
                    text: [
                        '**commands**',
                        '```',
                        '  pr ls [open|closed|all]  List Pull Requests',
                        '```'
                    ].join('\n')
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
        }
    }

    /**
     * @params {object} request, response
     */
    process_outgoing_response({ request, response }) {
        // request              {object} - the object returned by prepare_outgoing_request

        // response.error       {object}
        // response.status_code {integer}
        // response.content     {object}
        // response.content_raw {string/object}
        // response.headers     {object}

        var text = [];
        response.content.forEach(function(pr) {
            text.push('> '+pr.state+' [#'+pr.number+']('+pr.html_url+') - '+pr.title);
        });

        // Return false will abort the response
        // return false;

        // Return empty will proceed with the default response process
        // return;

        return {
            content: {
                text: text.join('\n'),
                parseUrls: false
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
    }
}