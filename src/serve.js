const url = require('url');
const http = require("http");
const tweBBQ = require('./tweBBQ_server')
const fetchTweet = require('./fetchTweet');

tweBBQ.openBrower();

http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    let params = url.parse(req.url, true);
    let twitter_url = params.query["twitter_url"];
    let template = params.query["template"];
    let cook = params.query["cook"];

    if (typeof twitter_url === "string" && /^https:\/\/twitter.com\/.+?\/status\/\d+\/?/.test(twitter_url)) {
        if (cook == "raw") {
            fetchTweet.complex(twitter_url)
                .then(tweet => {
                    if (cook == "raw") {
                            tweBBQ.complex("raw", twitter_url).then(pic => {
                            res.write(JSON.stringify({tweet : tweet, pic : pic}));
                            res.end();
                        });
                    }
                });
        }
        else if (cook == "bbq" && typeof template === "string" && template.length > 1) {
            try {
                template = JSON.parse(template);
                console.log(template)
                tweBBQ.complex("bbq", twitter_url, template).then(pic => {
                    res.write([pic].join(""));
                    res.end();
                });
                
            } catch(err) {
                console.log(err)
                return;
            }
        }
    }
}).listen(6800);