const axios = require('axios');

const BEARER_TOKEN = "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";

function getSingleTweet(tweet_id_str) {
    return axios({
        method:'GET',
        url: "https://api.twitter.com/1.1/statuses/show.json",
        headers : {
            "authorization" : BEARER_TOKEN,
        },
        params : {
            "id" : tweet_id_str,
            "include_entities" : "true",
            "include_ext_alt_text" : "true",
            "include_card_uri" : "true",
            "tweet_mode" : "extended",
            "include_ext_media_color" : "true",
            "include_ext_media_availability" : "true",
            "include_cards" : "1",
            "cards_platform" : "Web-12",
        }
    }).then(res => {return res.data; 
    }).catch(err => {
        console.error(err.response.data);
        return false;
    });
}

async function format(tweet) {
    let payload = [];
    let text = "";
    text = 'full_text' in tweet ? tweet.full_text : tweet.text;

    if ("is_quote_status" in tweet && tweet.is_quote_status == true) {
        let quote_tweet = await getSingleTweet(tweet.quoted_status_id_str);
        payload.push("--quote=" + await format(quote_tweet));
        text = text.replace(tweet.quoted_status_permalink.url, "");
    }
    if ("in_reply_to_status_id" in tweet && tweet.in_reply_to_status_id != null) {
        let reply_tweet = await getSingleTweet(tweet.in_reply_to_status_id_str);
        payload.push("--reply=" + await format(reply_tweet));
    }
    if ("card" in tweet) {
        if (/poll\dchoice/.test(tweet.card.name)) {
            let nchoice = parseInt(/\d/.exec(tweet.card.name)[0]);
            let count = "";
            let lable = "";
            for (i = 1; i < nchoice + 1; i++) {
                lable = tweet.card.binding_values[`choice${i}_label`].string_value;
                // count = tweet.card.binding_values[`choice${i}_count`].string_value;
                payload.push(`--choice=${lable}`);
            }
        }
    }

    payload.unshift(`${text}`);
    return payload.join("");
}

function tweetElem(tweet_str) {
    const elem_list = tweet_str.split(/--/);
    let elem = {};

    for (item of elem_list) {
        let start = item.indexOf("=");
        let key = item.substring(0, start);
        let value = item.substring(start + 1, item.length);
        switch (key) {
            case "quote" : {
                elem.quote = value;
                break;
            }
            case "reply" : {
                if (!Array.isArray(elem.reply)) elem.reply = [];
                elem.reply.push(value);
                break;
            }
            case "choice" : {
                elem.choice = value;
                break;
            }
            default : elem.text = value;
        }
    }
    return elem;
}

// async function tweetElem(tweet) {
//     let elem = {};
//     elem.text = ('full_text' in tweet) ? tweet.full_text : tweet.text;
//     // console.log(tweet)
//     if ("is_quote_status" in tweet && tweet.is_quote_status == true) {
//         let quote_tweet = await getSingleTweet(tweet.quoted_status_id_str);
//         // quote_tweet = tweetElem(quote_tweet)
//         elem.quote = ('full_text' in quote_tweet) ? quote_tweet.full_text : quote_tweet.text
//     }
//     if ("in_reply_to_status_id" in tweet && tweet.in_reply_to_status_id != null) {
//         elem.reply = [];
//         let reply_tweet = await getSingleTweet(tweet.in_reply_to_status_id_str);
//         reply_tweet = await tweetElem(reply_tweet);

//         elem.reply.push(reply_tweet);

//         console.log(elem)
//         // reply_tweet = tweetElem(reply_tweet);
        
//     }
//     if ("card" in tweet) {
//         if (/poll\dchoice/.test(tweet.card.name)) {
//             let nchoice = parseInt(/\d/.exec(tweet.card.name)[0]);
//             elem.choice = [];
//             for (i = 1; i < nchoice + 1; i++) {
//                 lable = tweet.card.binding_values[`choice${i}_label`].string_value;
//                 elem.choice.push(lable);
//             }
//         }
//     }
//     return elem;
// }

function complex(twitter_url) {
    let tweet_id = /status\/(\d+)/i.exec(twitter_url)[1];
    return new Promise((resolve) => {
        getSingleTweet(tweet_id).then(tweet => {
            format(tweet).then(tweet_str => {
                let elem = tweetElem(tweet_str);
                resolve(elem);
                console.log(elem)
            });
        });
    });
}

module.exports = {complex};

complex("https://twitter.com/MahiroYukishiro/status/1291681562753343488")