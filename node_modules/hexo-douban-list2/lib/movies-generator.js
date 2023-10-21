'use strict';

var _ = require('underscore');
var request = require('urllib-sync').request;
var ejs = require('ejs');
var xpath = require('xpath');
var path = require('path');
var Dom = require('@xmldom/xmldom').DOMParser;
var renderStar = require('./util').renderStar;
var i18n = require('./util').i18n;
var offline = false;

var log = require('hexo-log')({
    debug: false,
    silent: false
});

 

function resolv(url, timeout, plist) {

    var response = '';
    try {
        response = request(url, {
            timeout: timeout,
            dataType: 'xml'
        });
    } catch (err) {
        offline = true;
    }

    if (offline) {
        return {
            list: [],
            next: ""
        };
    }

    var doc = new Dom({
        errorHandler: {
            warning: function (e) {
            },

            error: function (e) {
            },

            fatalError: function (e) {
            }
        }
    }).parseFromString(response.data.toString());

    var items = xpath.select('//div[@class="grid-view"]/div[@class="item"]', doc);
    var next = xpath.select('string(//span[@class="next"]/a/@href)', doc);
    if (next.startsWith("/")) {
        next = "https://movie.douban.com" + next;
    }
 

    var list = [];
    for (var i in items) {
        var parser = new Dom().parseFromString(items[i].toString());
        var title = xpath.select1('string(//li[@class="title"]/a/em)', parser);
        var alt = xpath.select1('string(//li[@class="title"]/a/@href)', parser);
        var image = xpath.select1('string(//div[@class="item"]/div[@class="pic"]/a/img/@src)', parser).replace('ipst', 'spst');

        var tags = xpath.select1('string(//li/span[@class="tags"])', parser);
        tags = tags ? tags.substr(3) : '';
        var date = xpath.select1('string(//li/span[@class="date"])', parser);
        date = date ? date : '';

        var recommend = xpath.select1('string(//li/span[starts-with(@class,"rating")]/@class)', parser);
        recommend = renderStar(recommend.substr(6, 1));
        var comment = xpath.select1('string(//li/span[@class="comment"])', parser);
        comment = comment ? comment : '';

        var info = xpath.select1('string(//li[@class="intro"])', parser);
        info = info ? info : '';

        //image = 'https://images.weserv.nl/?url=' + image.substr(8, image.length - 8) + '&w=100';
        var chref = "";
        var ctitle = "";
        if(comment=="" && plist.get(alt)!=null){
            //console.log(plist.get(alt).pcomment);
            comment = plist.get(alt).pcomment;
            chref = plist.get(alt).cmhref;
            ctitle = "《"+plist.get(alt).cmtitle+"》";
        }

        list.push({
            title: title,
            alt: alt,
            image: image,
            tags: tags,
            date: date,
            recommend: recommend,
            comment: comment,
            chref: chref,
            ctitle: ctitle,
            info: info
        });
    }

    return {
        'list': list,
        'next': next
    };
}

module.exports = function (locals) {

    var config = this.config;
    if (!config.douban || !config.douban.movie) {//当没有输入movie信息时，不进行数据渲染。
        return;
    }

    var root = config.root;
    if (root.endsWith('/')) {
        root = root.slice(0, root.length - 1);
    }

    var timeout = 100000;
    if (config.douban.timeout) {
        timeout = config.douban.timeout;
    }

    /* get long comments start */ 
    var plist = new Map(); // 空Map
    for(var index=0; index<100; index++){
        var ip = _.random(1 , 254) + "." + _.random(1 , 254) + "." + _.random(1 , 254) + "." + _.random(1 , 254);
        var LongcmtUrl = 'https://movie.douban.com/people/' + config.douban.user + '/reviews?start='+index*10;
        var response = '';
        try {response = request(LongcmtUrl, {timeout: timeout, dataType: 'xml'});
        } catch (err) {offline = true;}
        if (offline) { return {list: [],next: ""};}
        var doc = new Dom({errorHandler: {
            warning: function (e) {},error: function (e) {},fatalError: function (e) {}
        }}).parseFromString(response.data.toString());
        var items = xpath.select('//div[@class="article"]/div[@class=""]/ul[@class="tlst clearfix"]', doc);
       //console.log(plist.size);
        if(items==null||items=="")break;
        var next = xpath.select('string(//span[@class="next"]/a/@href)', doc);
        if (next.startsWith("/")) {
            next = "https://movie.douban.com" + next;
        }
        for (var i in items) {
            var parser = new Dom().parseFromString(items[i].toString());
            //var title = xpath.select1('string(//li[@class="ilst"]/a/@title)', parser);
            var phref = xpath.select1('string(//li[@class="ilst"]/a/@href)', parser);
            //var phref = xpath.select1('string(//li[@class="ilst"]/a/img/@src)', parser);
            //var cmtitle = xpath.select1('string(//li[@class="nlst"]/h3/a/@title)', parser);
            //var recommend = xpath.select1('string(//li[@class="clst report-link"]/span/span[starts-with(@class,"allstar")]/@class)', parser);
            var pcomment = xpath.select1('string(//li[@class="clst report-link"]/div[@class="review-short"]/span)', parser);
            var cmtitle = xpath.select1('string(//li[@class="nlst"]/h3/a/@title)', parser);
            var cmhref = xpath.select1('string(//li[@class="nlst"]/h3/a/@href)', parser);
            plist.set( phref, {pcomment,cmtitle,cmhref});
            //console.log(phref+" : "+pcomment);
        }
    }
 
    /* get long comments end */ 



    var startTime = new Date().getTime();
    var wish = [];
    var watched = [];
    var watching = [];


    var wishUrl = 'https://movie.douban.com/people/' + config.douban.user + '/wish';
	
    for (var nextWish = wishUrl; nextWish;) {
        var resWish = resolv(nextWish, timeout, plist);
        nextWish = resWish.next;
        wish = wish.concat(resWish.list);
    }

    var watchedUrl = 'https://movie.douban.com/people/' + config.douban.user + '/collect';

    var maxi = 0;
    for (var nextWatched = watchedUrl; nextWatched;) {
        var resWatched = resolv(nextWatched, timeout, plist);
        nextWatched = resWatched.next;
        watched = watched.concat(resWatched.list);
        if(++maxi>config.douban.movie.length)break;
    }

    //var watchingUrl = 'https://movie.douban.com/people/' + config.douban.user + '/do';
    //for (var nextWatching = watchingUrl; nextWatching;) {
    //    var resWatching = resolv(nextWatching, timeout, plist);
    //    nextWatching = resWatching.next;
   //     watching = watching.concat(resWatching.list);
    //}



    //for (var nextLongcmtUrl = LongcmtUrlUrl; nextLongcmtUrl;) {
    //    var resLongcmtUrl = resolv(nextLongcmtUrl, timeout);
    //    nextLongcmtUrl = resLongcmtUrl.next;
    //    LongcmtUrl = LongcmtUrl.concat(resLongcmtUrl.list);
    //}

    var endTime = new Date().getTime();

    var offlinePrompt = offline ? ", because you are offline or your network is bad" : "";

    log.info(wish.length + watched.length + ' movies have been loaded in ' + (endTime - startTime) + " ms" + offlinePrompt);

    var __ = i18n.__(config.language);

    var contents = ejs.renderFile(path.join(__dirname, 'templates/movie.ejs'), {
        'quote': config.douban.movie.quote,
        'vappid': config.douban.movie.waline_id,
        'vappkey': config.douban.movie.waline_key,
        'len': config.douban.movie.textlen,
        'wish': wish,
        'watched': watched,
        'watching': watching,
        '__': __,
        'root': root
    },
        function (err, result) {
            if (err) console.log(err);
            return result;
        });

    return {
        path: 'movies/index.html',
        data: {
            title: config.douban.movie.title,
            content: contents,
            slug: 'movies'
        },
        layout: ['page', 'post']
    };
};
