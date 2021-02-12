const puppeteer = require('puppeteer');
const mongodb = require('mongodb').MongoClient;
const axios = require('axios');

const db_port = 27017;
const db_path = "mongodb://127.0.0.1:" + db_port;
const twemoji_reg = new RegExp(/(?:\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d])|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udeeb\udeec\udef4-\udefc\udfe0-\udfeb]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78\udd7a-\uddb4\uddb7\uddba\uddbc-\uddcb\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7a\ude80-\ude86\ude90-\udea8\udeb0-\udeb6\udec0-\udec2\uded0-\uded6]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g);

let connection = true;

const defaultTemplate = {
    article : {
        css : "",
        size : 'inherit',
        color : 'inherit',
        background : "",
        font_family : "source-han-sans",
        text_decoration : ""
    },
    group : {
        group_info : "翻译自日文",
        css : "",
        size : '18px',
        color : 'rgb(27, 149, 224)' ,
        background : "",
        font_family : "source-han-sans",
        text_decoration : ""
    },
    cover_origin : false,
    no_group_info : false,
    cover_origin_in_reply : false,
    no_group_info_in_reply : false
}

let replyFunc = (context, msg, at = false) => {console.log(msg)};

function cookTweReply(replyMsg) {
    replyFunc = replyMsg;
}

/** 检查网络情况，如果连不上Twitter那后面都不用做了*/
function checkConnection() {
    return axios.get("https://twitter.com").then(res => {connection = (res.status == 200) ? true : false}).catch(err => connection = false);
}

let browser = {};

async function openBrower() {
    browser = await puppeteer.launch({
        args : ['--no-sandbox', '--disable-dev-shm-usage'],
        headless : true
    });
    
}

/**
 * Twitter截图
 * @param {object} context 
 * @param {string} twitter_url 单条Tweet网址
 * @param {object} trans_args 所有翻译相关选项
 */
async function tweetShot(context, twitter_url, trans_args={}) {
    // let browser = await puppeteer.launch({
    //     args : ['--no-sandbox', '--disable-dev-shm-usage'],
    //     headless : false
    // });

    let page = await browser.newPage();
    await page.bringToFront();
    await page.setExtraHTTPHeaders({
        "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36",
        "accept-language" : "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
        "DNT" : "1"
    });
    await page.emulateTimezone('Asia/Tokyo');
    await page.goto(twitter_url, {waitUntil : "networkidle0"});

    try {
        if (Object.keys(trans_args).length > 0) {
            let html_ready = await setupHTML(trans_args);
            let video_poster = await blockVideo(twitter_url);
            if (trans_args.cover_origin != undefined && trans_args.cover_origin_in_reply == undefined) {
                trans_args.cover_origin_in_reply = trans_args.cover_origin;
            }
            if (trans_args.no_group_info != undefined && trans_args.no_group_info_in_reply == undefined) {
                trans_args.no_group_info_in_reply = trans_args.no_group_info;
            }
            if (trans_args.article.retweet != undefined) {
                trans_args.article.retweet = `<div class="css-901oao">${decoration(trans_args.article.retweet, trans_args.article)}</div>`;
            }

            await page.evaluate((html_ready, trans_args, video_poster) => {
                let banner = document.getElementsByTagName('header')[0];
                banner.parentNode.removeChild(banner);
                let header = document.getElementsByClassName("css-1dbjc4n r-aqfbo4 r-14lw9ot r-my5ep6 r-rull8r r-qklmqi r-gtdqiz r-ipm5af r-1g40b8q")[0];
                header.parentNode.removeChild(header);
                let footer = document.getElementsByClassName('css-1dbjc4n r-aqfbo4 r-1p0dtai r-1d2f490 r-12vffkv r-1xcajam r-zchlnj')[0];
                footer.parentNode.removeChild(footer);

                let articles = document.querySelectorAll('article');
                articles[0].scrollIntoView(true);
                let article = articles[0].querySelector('[role=group]').parentElement;
                insert(article, html_ready.trans_article_html, html_ready.trans_group_html, trans_args.cover_origin);

                if (video_poster) article.children[1].firstElementChild.firstElementChild.innerHTML = video_poster;

                if (trans_args.article.retweet != undefined) {
                    article.children[1].firstElementChild.firstElementChild.children[1].firstElementChild.children[1].firstElementChild.innerHTML 
                         = trans_args.article.retweet;
                }

                if (trans_args.article.choice != undefined) {
                    let choice_list = article.children[1].querySelectorAll("span");
                    for (let i = 0; i < choice_list.length/2; i++) choice_list[2*i].innerText = trans_args.article.choice[i];
                }

                if (html_ready.reply_html != undefined) {
                    for (let i = 0; i < html_ready.reply_html.length; i++) {
                        if (i+1 >= articles.length) break;
                        else {
                            article = articles[i+1].querySelector('[role=group]').parentElement;
                            insert(article, html_ready.reply_html[i], 
                                trans_args.no_group_info_in_reply ? '' : html_ready.trans_group_html,
                                trans_args.cover_origin_in_reply);
                        }
                    }
                }

                function insert(article, translation_html, group_html, cover_origin=false) {
                    let trans_place = document.createElement('div');
                    let node_group_info = document.createElement('div');
                    let node_trans_article = document.createElement('div');

                    trans_place.dir = "auto";
                    node_group_info.dir = "auto";
                    node_trans_article.dir = "auto";

                    node_group_info.innerHTML = group_html;
                    node_trans_article.innerHTML = translation_html;

                    if (/^回复 \n@/.test(article.firstElementChild.innerText)) article = article.children[1];
                    else article = article.firstElementChild;

                    trans_place.appendChild(node_group_info);
                    trans_place.appendChild(node_trans_article);

                    if (cover_origin) article.firstElementChild.replaceWith(trans_place);
                    else article.appendChild(trans_place);
                }
                document.querySelector("#react-root").scrollIntoView(true);
            }, html_ready, trans_args, video_poster);
        }
        else {
            await page.evaluate(() => {
                let banner = document.getElementsByTagName('header')[0];
                banner.parentNode.removeChild(banner);
                let header = document.getElementsByClassName("css-1dbjc4n r-aqfbo4 r-14lw9ot r-my5ep6 r-rull8r r-qklmqi r-gtdqiz r-ipm5af r-1g40b8q")[0];
                header.parentNode.removeChild(header);
                let footer = document.getElementsByClassName('css-1dbjc4n r-aqfbo4 r-1p0dtai r-1d2f490 r-12vffkv r-1xcajam r-zchlnj')[0];
                footer.parentNode.removeChild(footer);
                document.querySelector("#react-root").scrollIntoView(true);
            });
        }
    } catch(err) {
        console.error(err);
        replyFunc(context, "出错惹", true);
        await browser.close();
        return;
    }
    
    await page.waitFor(1000);
    await page.bringToFront();
    let tweet_box = await page.$('.css-1dbjc4n .r-vpgt9t').then((tweet_end) => {return tweet_end.boundingBox()});
    await page.waitFor(1000);

    await page.setViewport({
            width: 800,
            height: Math.round(tweet_box.y + 200),
            deviceScaleFactor: 1.6
        });

    let filename = new Date().getUTCMilliseconds();
    let path = `${__dirname}/img/${filename}.jpg`;
    await page.screenshot({
        type : "jpeg",
        quality : 100,
        clip : {x : tweet_box.x - 15, y : 0, width : tweet_box.width + 22, height : tweet_box.y + tweet_box.height + 18},
        path: path
    });

    await page.close();
    return filename;
}

function blockVideo(twitter_url) {
    return axios({
        method:'GET',
        url: "https://api.twitter.com/1.1/statuses/lookup.json",
        headers : {"authorization" : "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"},
        params : {
            "id" : /status\/(\d+)/.exec(twitter_url)[1],
            "include_entities" : "true",
            "include_ext_alt_text" : "true",
            "include_card_uri" : "true",
            "tweet_mode" : "extended"
        }
    }).then(res => {
        let tweet = res.data[0];
        if ("extended_entities" in tweet && tweet.extended_entities.media != undefined && tweet.extended_entities.media[0].type == 'video') {
            return axios.get(tweet.extended_entities.media[0].media_url_https, {responseType:'arraybuffer'})
                        .then(res => {
                            let img64 = "data:image/jpeg;base64," + Buffer.from(res.data, 'binary').toString('base64');
                            return `<img style="max-height:100%; max-width:100%" src="${img64}">`;
                        });
        }
        else return false;
    }).catch(err => {
        console.error(err.response.data);
        return false;
    });
}

async function setupHTML(trans_args) {
    trans_args = fillTemplate(trans_args);
    let html_ready = {}

    html_ready.trans_article_html = trans_args.article_html == undefined ? decoration(trans_args.article.origin, trans_args.article) : trans_args.article_html;
    html_ready.trans_article_html = `<div class="css-901oao r-hkyrab r-1tl8opc r-1blvdjr r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0">${html_ready.trans_article_html}</div>`

    if (trans_args.article.reply != undefined && trans_args.article.reply.length > 0) {
        html_ready.reply_html = [];
        for (let reply of trans_args.article.reply) html_ready.reply_html.push(decoration(reply, trans_args.article));
    }
    if (!trans_args.no_group_info) {
        if (/^https/.test(trans_args.group.group_info)) {
            trans_args.group.size = trans_args.group.size == "inherit" ? '2em' : trans_args.group.size;
            let img64 = "data:image/jpeg;base64," + await axios.get(trans_args.group.group_info, {responseType:'arraybuffer'})
                                                                .then(res => {return Buffer.from(res.data, 'binary').toString('base64')});
            html_ready.trans_group_html = `<img style="margin: 2px 0px 0px 0px; height: auto; width: auto; max-height: ${trans_args.group.size}; max-width: 100%;" src="${img64}">`;
        }
        else {
            html_ready.trans_group_html = (trans_args.group_html == undefined) ? 
                ['<div dir="auto" class="css-901oao r-hkyrab r-1tl8opc r-1blvdjr r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0" style="margin: 0px 0px 3px 1px;">', 
                decoration(trans_args.group.group_info, trans_args.group), '</div>'].join("")
                : ['<div dir="auto" class="css-901oao r-hkyrab r-1tl8opc r-1blvdjr r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0" \
                style="margin: 0px 0px 3px 1px;">', trans_args.group_html, '</div>'].join("");
        }
    }
    else html_ready.trans_group_html = "";
    return html_ready;
}

function decoration(text, template) {
    let css = ('css' in template && template.css.length > 1) ? template.css
        : template ? `font-family: ${template.font_family}; font-size: ${template.size}; text-decoration: ${template.text_decoration}; color: ${template.color}; background: ${template.background};` : "";
    let ready_html = 
        `<div style="all: inherit; ${css}">${parseString(text, template)}</div>`;

    return ready_html;
}

function parseString(text) {
    text = text.replace(/(\S*)(#\S+)/gi,'$1<span style="color:#1DA1F2;">$2</span>')
                .replace(/((https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/g,'<span style="color:#1DA1F2;">$1</span>');
                
    let capture = [...text.matchAll(twemoji_reg)];
    let ready_html = "";
    let string_html = "";
    let emoji_html = "";

    if (capture[0] != undefined) {
        let offset = 0;
        let code = "";
        let part = "";
        
        for (let emoji of capture) {
            code = emoji[0].codePointAt(0).toString(16);
            part = text.substring(offset, emoji.index);
            string_html = (part.length > 0) ? crtString(part) : "";
            emoji_html =
                [`<span dir="auto" class="css-901oao css-16my406 r-4qtqp9 r-ip8ujx r-sjv1od r-zw8f10 r-bnwqim r-h9hxbl">`,
                `<div aria-label="${emoji[0]}" class="css-1dbjc4n r-xoduu5 r-1mlwlqe r-1d2f490 r-1udh08x r-u8s1d r-h9hxbl r-417010" style="height: 1.2em;">`,
                '<div class="css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-x3cy2q r-1p0dtai r-xoduu5 r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw"',
                `style="background-image: url(&quot;https://abs-0.twimg.com/emoji/v2/svg/${code}.svg&quot;);"></div>`,
                `<img alt="${emoji[0]}" draggable="false" src="https://abs-0.twimg.com/emoji/v2/svg/${code}.svg" class="css-9pa8cd"></div></span>`].join("");

                ready_html += (offset > emoji.index) ? emoji_html + string_html : string_html + emoji_html;
                offset = emoji.index + emoji[0].length;
        }
        if (offset < text.length) ready_html += crtString(text.substr(offset, text.length-1));
    }
    else {
        ready_html = crtString(text);
    }
    return ready_html;
    
    function crtString(text_part) {
        return `<span dir="auto" style="all:inherit;">${text_part}</span>`;
    }
}

function setTemplate(unparsed) {
    let trans_args = {article : {}, group : {}};
    let style_options = unparsed.split(/[+＋]/);
    let option = "";
    let style = "";
    let err = false;
    let option_map = {
        "翻译" : "origin",
        "回复" : "reply",
        "颜色" : "color",
        "大小" : "size",
        "字体" : "font_family",
        "装饰" : "text_decoration",
        "css" : "css",
        "汉化组" : "group_info",
        "汉化组大小" : "group_size",
        "汉化组颜色" : "group_color",
        "汉化组字体" : "group_font_family",
        "汉化组装饰" : "group_text_decoration",
        "汉化组css" : "group_css",
        "背景" : "background",
        "引用" : "retweet",
        "选项" : "choice",
        "覆盖" : "cover_origin",
        "无汉化组" : "no_group_info",
        "回复中覆盖" : "cover_origin_in_reply",
        "回复中无汉化组" : "no_group_info_in_reply",
        "group_html" : "group_html",
        "article_html" : "article_html",
        "error" : false
    }

    for (let i in style_options) {
        option = style_options[i].split(/(?<!<.+(style))[=＝]/).filter((noEmpty) => {return noEmpty != undefined});
        style = option_map[option[0].trim().replace(/<br>/g, "")] || option_map["error"];

        if (!style) err = `没有${option[0]}这个选项`;
        else if (style == "article_html" || style == "group_html") trans_args[style] = option[1].trim();
        else {
            if (style == "origin" || style == "reply" || style == "group_info");
            else if (option[1]) option[1].trim().replace(/<br>/g, "");

            if (/^group_/.test(style) && !/\[CQ:image/.test(option[1])) trans_args.group[style.replace(/^group_(?!info)/, "")] = option[1];
            else if (style == 'cover_origin') trans_args.cover_origin = true;
            else if (style == 'no_group_info') trans_args.no_group_info = true;
            else if (style == 'cover_origin_in_reply') trans_args.cover_origin_in_reply = true;
            else if (style == 'no_group_info_in_reply') trans_args.no_group_info_in_reply = true;
            else if (style == 'group_info' && /\[CQ:image/.test(option[1])) trans_args.group.group_info = option[3];
            else if (style == 'choice') {
                trans_args.article.choice = option[1].split(/[;；]/).filter((noEmpty) => {return noEmpty != undefined && noEmpty.length > 0});
            }
            else if (style == 'reply') {
                if (!Array.isArray(trans_args.article.reply)) trans_args.article.reply = [option[1]];
                else trans_args.article.reply.push(option[1]);
            }
            else trans_args.article[style] = option[1];
        }
    }

    return {trans_args : trans_args, err : err};
}

function fillTemplate(template = {}) {
    return new Proxy(template, handler = {
        get : (target, prop) => {
            if (typeof(defaultTemplate[prop]) === 'object') {
                return !Reflect.has(target, prop) ? defaultTemplate[prop] :
                    new Proxy(target[prop], handler = {
                        get : (deep_target, deep_prop) => {
                            return Reflect.has(deep_target, deep_prop) ? deep_target[deep_prop] : defaultTemplate[prop][deep_prop];
                        }
                    });
            }
            return target.hasOwnProperty(prop) ? target[prop] : defaultTemplate[prop];
        }
    });
}

function saveTemplate(context, username, unparsed_text) {
    let {trans_args, err} = setTemplate(unparsed_text);

    if (err) {
        replyFunc(context, err, true);
        return;
    };
    if ('origin' in trans_args.article || 'reply' in trans_args.article || "retweet" in trans_args.article || "choice" in trans_args.article) {
        replyFunc(context, '不能将翻译内容加入模板', true);
        return;
    }

    mongodb(db_path, {useUnifiedTopology: true}).connect().then(async mongo => {
        let coll = mongo.db('bot').collection('twiBBQ');
        try {
            await coll.updateOne({username : username}, 
                {$set : {trans_args}}, {upsert : true});
            replyFunc(context, `成功保存了${username}的模板，恭喜恭喜`);
        } catch(err) {
            console.error(err);
            replyFunc(context, "出错惹");
        } finally {mongo.close();}
    });
}

function findTemplate(username) {
    return mongodb(db_path, {useUnifiedTopology: true}).connect().then(async mongo => {
        let coll = mongo.db('bot').collection('twiBBQ');
        try {
            let res = await coll.findOne({username : username});
            return (res) ? res.trans_args : false;
        } catch(err) {console.error(err);
        } finally {mongo.close();}
    });
}

function cookTweet(context, twitter_url, template) {
    let username = /twitter\.com\/(.+?)\/status\//.exec(twitter_url)[1];
    return findTemplate(username).then(saved_trans_args => {
        if (!saved_trans_args) saved_trans_args = defaultTemplate;

        for (let key in saved_trans_args) {
            if (typeof(saved_trans_args[key]) == "object") {
                template[key] = Object.assign(saved_trans_args[key], template[key]);
            }
            else template[key] = template[key] != undefined ? template[key] : saved_trans_args[key];
        }

        if (!('trans_html' in template) && !('origin' in template.article) && !('reply' in template.article)) {
            replyFunc(context, "你没加翻译", true);
            return;
        }

        return tweetShot(context, twitter_url, template)
            .then(pic => {
                return pic
            });
    });
    
}

function complex(context, twitter_url, template = {}) {
    if (context == "raw") {
        return tweetShot(context, twitter_url).then(pic => {
            return pic
        });
    }
    else if (context == "bbq") {
        return cookTweet(context, twitter_url, template);
    }
    else {
        return false;
    }
    
    // else if (/^保存烤制模板\s?https:\/\/twitter.com\/.+(?:\/)?[>＞].+/.test(context.message)) {
    //     let plain = context.message.replace(/\r\n/g, "");
    //     let {groups : {username, unparsed}} = /https:\/\/twitter.com\/(?<username>.+?)(?:\/status\/\d+)?[>＞](?<unparsed>.+)/.exec(plain);
    //     saveTemplate(context, username, unparsed);
    //     return true;
    // }
    
}

module.exports = {complex, cookTweReply, openBrower};

// let template = defaultTemplate;
// template.article.origin = "12312313"

// async function test() {
//     await openBrower()
//     complex("raw", "https://twitter.com/MahiroYukishiro/status/1291681562753343488")
//     .then(pic => {
//         console.log(pic)
//     });
// }
// test()


// await page.screenshot({
//     type : "jpeg",
//     quality : 100,
//     clip : {x : tweet_box.x - 15, y : -3, width : tweet_box.width + 25, height : tweet_box.y + tweet_box.height + 12},
//     path: `${__dirname}\\twitter.jpg`
// });

// let header = document.getElementsByClassName("css-1dbjc4n r-aqfbo4 r-14lw9ot r-my5ep6 r-rull8r r-qklmqi r-gtdqiz r-ipm5af r-1g40b8q")[0];
// header.parentNode.removeChild(header);