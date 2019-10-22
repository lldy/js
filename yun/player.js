

function getQuery(url) {
    if (typeof url !== 'string') {
        return null
    }
    var query = url.match(/[^\?]+\?([^#]*)/, '$1');
    if (!query || !query[1]) {
        return null
    }
    var kv = query[1].split('&');
    var map = {};
    for (var i = 0, len = kv.length; i < len; i++) {
        var result = kv[i].split('=');
        var key = result[0],
            value = result[1];
        map[key] = value || (typeof value == 'string' ? null : true)
    }
    return map
}

function getcookie(name) {
    var arr = "";
    var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

function setcookie(name, value) {
    var Days = 10;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
function Get_can() {
    var cna = getcookie("weParser_youku_cna");
    if (cna && cna != "undefined") {
        return cna;
    }
    else {
        $.ajax({
            url: "https://log.mmstat.com/eg.js",
            dataType: "script",
            cache: true,
            success: function () {
                cna = window.goldlog.Etag;
                setcookie("weParser_youku_cna", window.goldlog.Etag);
                return window.goldlog.Etag
            }
        });
    }
}
function playyoukuUPS(data) {

    var cna = getcookie("weParser_youku_cna");
    if (cna && cna != "undefined") {

        getUPS(data, cna);
        return
    } else {
        $.ajax({
            url: "https://log.mmstat.com/eg.js",
            dataType: "script",
            cache: true,
            success: function () {
                cna = window.goldlog.Etag;
                setcookie("weParser_youku_cna", window.goldlog.Etag);
                getUPS(data, cna);
            }
        });
    }
}

function getUPS(data, cna) {
    var get = getQuery(data["url"]);
    $.ajax({
        url: "https://ups.youku.com/ups/get.json",
        type: "GET",
        dataType: "jsonp",
        jsonpCallback: "json" + parseInt(new Date().getTime()),
        cache: true,
        data: {
            vid: get.vid,
            ccode: get.ccode,
            client_ip: "192.168.1.1",
            utid: get.utid ? get.utid : cna,
            client_ts: parseInt(new Date().getTime() / 1000),
            ckey: '7B19C0AB12633B22E7FE81271162026020570708D6CC189E4924503C49D243A0DE6CD84A766832C2C99898FC5ED31F3709BB3CDD82C96492E721BDD381735026'
        },
        success: function (e) {
            try {

                data["ext"] = 'm3u8';
                data["url"] = e.data.stream[0]['m3u8_url'];

                ckplayerLoad(data);
            } catch (error) {
                play_up();
            }
        }
    });

}

function playyouku(data) {

    var params = getQuery(data.url);

    var weparser_js_url = BASE64.de(decodeURIComponent(params.js_url));
    var weparser_swf_url = BASE64.de(decodeURIComponent(params.swf_url));
     var get = getQuery(weparser_swf_url);

    $.ajax({
        url: params.ccode == "0590" ? "https://ups.youku.com/ups/get.json" : "https://ups.cp31.ott.cibntv.net/ups/get.json",
        type: "GET",
        dataType: "jsonp",
        jsonpCallback: "json" + parseInt(new Date().getTime()),
        cache: true,
        data: {
            vid: params.vid,
            ccode: params.ccode,
            client_ip: "192.168.1.1",
            utid: get.utid ? get.utid : cna,
            client_ts: parseInt(new Date().getTime() / 1000),
            ckey: get.ckey
        },
        success: function (e) {
            try {

                data["ext"] = 'm3u8';
                data["url"] = e.data.stream[0]['m3u8_url'];

                ckplayerLoad(data);
            } catch (error) {
                play_up();
            }
        }
    });
}


function playQQ(data) {

    var url = data["url"];
    var get = getQuery(url);
    $.ajax({
        url: "//h5vv.video.qq.com/getinfo?charge=0&vid=" + get.vid + "&defaultfmt=auto&otype=json&guid=" + get.guid + "&platform=" + get.platform + "&defnpayver=1&appVer=3.0.83&sdtfrom=" + get.sdtfrom + "&host=v.qq.com&ehost=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Fnuijxf6k13t6z9b%2Fl0023olk3g4.html&_0=" + get._0 + "&defn=mp4&fhdswitch=0&show1080p=1&isHLS=0&newplatform=" + get.sdtfrom + "&defsrc=1&_1=" + get._1 + "&_2=" + get._2,
        dataType: 'jsonp',
        jsonpCallback: "txplayerJsonpCallBack_getkey_" + parseInt(Math.random() * 800000 + 80000),
        success: function (getinfo) {
            if (!getinfo.exem) {
                $.ajax({
                    url: url + '&filename=' + getinfo.vl.vi[0].lnk + '.mp4',
                    dataType: 'jsonp',
                    jsonpCallback: "txplayerJsonpCallBack_getkey_" + parseInt(Math.random() * 800000 + 80000),
                    success: function (json) {
                        var get = getQuery(url);


                        data["ext"] = 'mp4';
                        data["url"] = getinfo.vl.vi[0].ul.ui[0].url + json.filename + '?sdtfrom=' + get.sdtfrom + '&guid=' + get.guid + '&vkey=' + json.key;

                        ckplayerLoad(data);
                    }
                })
            } else {

            }
        }
    })
}

function qq_update(data) {
    var params = JSON.parse(data.url).preInfo;
    params.appver = '3.2.157';
    var p_fvkey;
    var p_url = 'http://ugcdl.video.gtimg.com/flv/48/228/';

    //http://h5vv.video.qq.com/getinfo?callback=txplayerJsonpCallBack_getinfo_658073&charge=0&vid=v00171d97b8&defaultfmt=auto&otype=json&guid=043b5b8c1d7ae7f1b9fb8c5647e17777&platform=10901&defnpayver=1&appVer=3.2.157&sdtfrom=v1010&host=v.qq.com&ehost=https%3A%2F%2Fv.qq.com%2Fx%2Fpage%2Fv00171d97b8.html&_rnd=1506603751&defn=mp4&fhdswitch=0&show1080p=1&isHLS=0&newplatform=10901&defsrc=1&_qv_rmt=VXsSV/gGA10635SCF=&_qv_rmt2=0uzbcsVG156071IQw=

    var getinfo = "//h5vv.video.qq.com/getinfo?callback=?&charge=0&vid=" + params.vid + "&defaultfmt=auto&otype=json&guid=" + params.guid + "&platform=10901&defnpayver=1&appVer=3.2.157&sdtfrom=v1010&host=v.qq.com&ehost=" + params.url + "&_rnd=" + params._rnd + "&defn=mp4&fhdswitch=0&show1080p=1&isHLS=0&newplatform=10901&defsrc=1&_qv_rmt=" + params._qv_rmt + "&_qv_rmt2=" + params._qv_rmt2;
    $.ajax({
        url: getinfo,
        type: "GET",
        dataType: "jsonp",
        async: false,
        complete: function () {
            var reportUrls = Array();
            reportUrls.push("//btrace.video.qq.com/kvcollect?BossId=4298&Pwd=686148428&uin=&vid=" + params.vid + "&coverid=" + params.coverid + "&pid=" + params.pid + "_10901&guid=" + params.guid + "&vt=&type=&url=" + params.url + "&bi=&bt=&version=3.2.157&platform=10901&format=&defn=&ctime=" + params.atimes + "&ptag=&isvip=0&tpid=2&pversion=html5hd&hc_uin=&hc_main_login=&hc_vuserid=&hc_openid=&hc_appid=&hc_pvid=&hc_ssid=&hc_qq=&hh_ua=Mozilla%2F5.0%20(iPhone%3B%20CPU%20iPhone%20OS%208_0%20like%20Mac%20OS%20X)%20AppleWebKit%2F600.1.3%20(KHTML%2C%20like%20Gecko)%20Version%2F8.0%20Mobile%2F12A4345d%20Safari%2F600.1.4&ckey=&iformat=&hh_ref=" + params.url + "&v_idx=0&rcd_info=&vurl=&step=3&val=1&idx=0&isfocustab=1&isvisible=1");

            reportUrls.push("//btrace.video.qq.com/kvcollect?BossId=4298&Pwd=686148428&uin=&vid=" + params.vid + "&coverid=" + params.coverid + "&pid=" + params.pid + "_10901&guid=" + params.guid + "&vt=&type=&url=" + params.url + "&bi=&bt=&version=3.2.157&platform=10901&format=&defn=&ctime=" + params.atimes + "&ptag=&isvip=0&tpid=2&pversion=html5hd&hc_uin=&hc_main_login=&hc_vuserid=&hc_openid=&hc_appid=&hc_pvid=&hc_ssid=&hc_qq=&hh_ua=Mozilla%2F5.0%20(iPhone%3B%20CPU%20iPhone%20OS%208_0%20like%20Mac%20OS%20X)%20AppleWebKit%2F600.1.3%20(KHTML%2C%20like%20Gecko)%20Version%2F8.0%20Mobile%2F12A4345d%20Safari%2F600.1.4&ckey=" + p_fvkey + "&iformat=&hh_ref=" + params.url + "&v_idx=0&rcd_info=&vurl=" + encodeURIComponent(p_url) + "&step=1011&val1=1&val2=0&val=5" + Math.ceil(100 * Math.random()));

            reportUrls.push("//btrace.video.qq.com/kvcollect?BossId=4298&Pwd=686148428&uin=&vid=" + params.vid + "&coverid=" + params.coverid + "&pid=" + params.pid + "_10901&guid=" + params.guid + "&vt=&type=&url=" + params.url + "&bi=&bt=&version=3.2.157&platform=10901&format=&defn=&ctime=" + params.atimes + "&ptag=&isvip=0&tpid=2&pversion=html5hd&hc_uin=&hc_main_login=&hc_vuserid=&hc_openid=&hc_appid=&hc_pvid=&hc_ssid=&hc_qq=&hh_ua=Mozilla%2F5.0%20(iPhone%3B%20CPU%20iPhone%20OS%208_0%20like%20Mac%20OS%20X)%20AppleWebKit%2F600.1.3%20(KHTML%2C%20like%20Gecko)%20Version%2F8.0%20Mobile%2F12A4345d%20Safari%2F600.1.4&ckey=" + p_fvkey + "&iformat=&hh_ref=" + params.url + "&v_idx=0&rcd_info=&vurl=&step=3&val=1&idx=0&isfocustab=1&isvisible=1");

            for (var i = 0; i < reportUrls.length; i++) {
                var r1 = document.createElement("img");
                r1.src = reportUrls[i];

            } //_rnd
            //            window._fvkey = p_fvkey

        },
        jsonpCallback: "txplayerJsonpCallBack_getinfo_" + parseInt(Math.random() * 800000 + 80000),
        success: function (g) {
          try {
            p_fvkey = g.vl.vi[0].fvkey;
            p_url = g.vl.vi[0].ul.ui[1].url;


            var mp4_do = "//h5vv.video.qq.com/getkey?charge=0&vid=" + params.vid + "&filename=" + params.vid + ".mp4&format=2&otype=json&guid=" + params.guid + "&platform=10901&defnpayver=0&appVer=3.2.157&vt=203&sdtfrom=v1010&_rnd=" + params._rnd + "&_qv_rmt=" + params._qv_rmt + "&_qv_rmt2=" + params._qv_rmt2;

            $.ajax({
                url: mp4_do,
                type: "GET",
                dataType: "jsonp",
                jsonpCallback: "txplayerJsonpCallBack_getinfo_" + parseInt(Math.random() * 800000 + 80000),
                success: function (date) {
                    console.log(p_url + date.filename + "?vkey=" + date.key);

                    data["ext"] = 'mp4';
                    data["url"] = p_url + date.filename + "?vkey=" + date.key;
                    data["msg"] = "ok";
                    ckplayerLoad(data);

                }
            });

        } catch (error) {
            play_up();
        }


        }
    });


}


function playiqiyi2(data) {

    $.ajax({
        url: data.url.replace('http:', ''),
        dataType: 'jsonp',
        jsonpCallback: "callbackfunction",
        success: function (json) {


            if (json.code == 'A00000') {
                if (isiPad) {
                    data.url = json.data.m3u;
                    data.ext = 'h5';
                    ckplayer_(data)
                } else {
                    var array = {};
                    for (var i = json.data.vidl.length - 1; i >= 0; i--) {
                        if (json.data.vidl[i].fileFormat != "H265") {
                            array[json.data.vidl[i].vd] = json.data.vidl[i]
                        }
                    };
                    if (array[4] != undefined) {
                        data.url = array[4].m3u
                    } else if (array[3] != undefined) {
                        data.url = array[3].m3u
                    } else if (array[2] != undefined) {
                        data.url = array[2].m3u
                    } else if (array[1] != undefined) {
                        data.url = array[1].m3u
                    } else if (array[96] != undefined) {
                        data.url = array[96].m3u
                    }

                    // data.url = '/pagefrom/m3u8?d=' + BASE64.en($.param(data));
                    data.ext = 'dm3u8';
                    ckplayerLoad(data)
                }
            } else {
                data["msg"] = "请稍后...";
                ckplayerLoad(data);
            }
        }
    })
}

function playiqiyi3(data) {
                    var url = data['url']+'&vf='+cmd5x(data['url']);
                    $.ajax({
                        url:'//cache.m.iqiyi.com'+url,
                        dataType: 'html',
                        success: function(json) {
                        if(url.indexOf("tmtsCallback")>0)
                        {
                        json = eval("("+json.substring(17,json.length - 15)+")");
                        }
                        else
                        {
                             json = eval("("+json.substring(13)+")");
                           }
                            if (json.code == 'A00000') {
                               data.url = json.data.m3u;
                                data.ext = 'dm3u8';
                                ckplayerLoad(data)
                            } else {
                                data["msg"] = "请稍后...";
                                ckplayerLoad(data);
                                return;
                            }
                        }
                    })


}


function playiqiyi(data) {
   
    $.ajax({
//        async: false,
        url: data["url"],
        type: "GET",
        dataType: 'text',
        success: function (json) {
           
            eval(json);
        }
    });
}


function tmtsCallback(jsn) {//function cbew9ufs(jsn){

    if (jsn.code == 'A00000') {
        var data = { "ext": "dm3u8", "msg": "ok", "url": jsn.data.m3u };


        ckplayerLoad(data);
    }
    else {
        data["msg"] = "请稍后...";
        ckplayerLoad(data);
    }
}
function sohuuid(data) {
    
   
var rptImg = document.createElement("img");
rptImg.src = '//mb.hd.sohu.com.cn/mc.gif?uid=' + data['Uid'] + '&url=1002&value=&memo=%7B%22status%22%3A%220%22%7D&passport=&mtype=12&ltype=0&cv=3.7.0&mos=3&mosv=10.0.15063.674&pro=1&mfo=To+Be+Filled+By+O.E.M.&mfov=To+Be+Filled+By+O.E.M.&webtype=wifi&vid=&time=' + Math.round(new Date().getTime() / 1000) + '&type=&channelid=419&sim=0&playlistid=&catecode=&preid=&newuser=0&enterid=0&startid=' + Math.round(new Date().getTime() / 1000);

ckplayerLoad(data['Data']);
				
}


function ckplayerLoad(data) {

  if(isIE()&&data['ext'] == 'hls')
  {
  data['ext']='m3u8';
 
  }
    var isiPad = navigator.userAgent.match(/iPad|iPhone|Android|Linux|iPod/i) != null;
    if (data['msg'] == 'ok') {
        if (data['ext'] == 'link') {
        var ref=document.getElementById('referer');
        if(ref!=null)
        ref.remove();
            $('#a1').html('<iframe width="100%" height="100%" allowTransparency="true" frameborder="0" scrolling="no" src="' + data['url'] + '"></iframe>');
         } else if (data['playertype'] == 'dplayer') {
            Dplayer_Load(data);
            return;
        } else if (data['ext'] == 'dplayer') {
            Dplayer_Load(data);
            return;
        } else if (data['ext'] == 'ajax') {
            $.getScript(data['url']);
        } else if (data['ext'] == 'youku_ac') {

            $.getScript(data['url']);
        } else if (data['ext'] == 'ajax_qq') {
            playQQ(data);
        } else if (data['ext'] == 'qq_update') {
            qq_update(data);
        } else if (data['ext'] == 'iqiyinormal') {
        weParser.iqiyi.parse(data['param']);
           
            return;
        } else if (data['ext'] == 'ajax_iqiyi') {
         playiqiyi3(data);
           
            return;
        } else if (data['ext'] == 'ajax_youku') {
            playyoukuUPS(data);
            return;
        } else if (data['ext'] == 'ajax_youku_js') {
            playyouku(data);
            return;
        } else if (data['ext'] == 'sohu') {
            sohuuid(JSON.parse(data.url));
        } else if (data['ext'] == 'qqv') {
            webtools.csrf_qqv(data['url']);
        } else if (data['ext'] == 'dplay'||data['ext'] == 'hls') {
            Dplayer_Load(data);
            return;
        } else if (isiPad || data['ext'] == 'h5') {


            $('#a1').html('<video  id="videoPlayer" src="' + data['url'] + '" controls="controls" width="100%" height="100%"></video>');

            setInterval('error()', 3000);
        }  else if (data['ext'] == 'dm3u8') {
            Dplayer_Load(data);
            return;

        } else if (data['ext'] == 'dmp4'||data['ext'] == 'mp4') {
            Dplayer_Load(data);
            return;
       
        } else {
            if (data['ext'] == 'm3u8' || data['ext'] == 'm3u8_list') {
                var flashvars = { f: '/ckplayer/m3u8.swf', a: escape(data['url']), c: 0, s: 4, lv: 0, p: 1, v: 100, loaded: 'error' };
            } else if (data['ext'] == 'mp4') {

                var flashvars = { f: data['url'], c: 0, s: 0, p: 1, v: 100, h: 3, loaded: 'error' };
            } else if (data['ext'] == 'xml') {

                var flashvars = { f: data['url'], c: 0, s: 2, p: 1, v: 100, h: 4, loaded: 'error' };
            }
            else if (data['ext'] = 'self') {
                var flashvars = { f: data['url'], c: 0, s: 2, p: 1, v: 100, h: 4 };
            }
            var params = { bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', wmode: 'transparent' };
            CKobject.embedSWF('https://cdn.jsdelivr.net/gh/lldy/js@v1.5/yun/ckplayer/ckplayer.swf', 'a1', 'ckplayer_a1', '100%', '100%', flashvars, params);

        }

        $('#loading').hide();
        $('#a1').show();
    }
    else {
        $('#loading').hide();
        $('#a1').hide();
        $('#error').show();
        $('#error').html(data['msg']);
        play_up();
    }


}

var dp;
 var hlsjsConfig = {
        debug: false,
        // Other hlsjsConfig options provided by hls.js
        p2pConfig: {
            logLevel: 'true'
            // Other p2pConfig options provided by CDNBye
        }
    };
function Dplayer_Load(data) {
//var dplaytype='auto';
//if(data['ext']=='m3u8'||data['ext']=='dm3u8'||data['ext']=='hls'||data['ext']=='p2p')
//{
//dplaytype='customHls';
//}

     dp = new DPlayer({
        element: document.getElementById('a1'),
        autoplay: false,
        video: {
            url: data['url'],
            type: 'auto',
            pic: 'content/images/bj.jpg'
//              customType: {
//                'customHls': function (video, player) {
//                    var hls = new Hls(hlsjsConfig);
//                   
//                   
//                    hls.loadSource(video.src);
//                    hls.attachMedia(video);
//                    hls.engine.on('stats',p2pshow);
//                }
//            }
        },
          contextmenu: [
        {
            text: '交流群',
            link: 'https://jq.qq.com/?_wv=1027&k=5AsIMME'
        }
       
    ]
    });
    dp.on('error', play_up);
    $('#loading').hide();
    $('#a1').show();
}


function p2pshow(p2pobj)
{
var body = document.getElementsByTagName('body')[0];
				if (body) {
					var p2pserver_div = document.getElementById('p2pserver');
					if (!p2pserver_div) {
						var div = document.createElement('div');
						div.innerHTML = '\u7b49\u5f85\u0050\u0032\u0050\u52a0\u901f';
						div.id = 'p2pserver';
						div.style = 'padding: 5px;position: absolute;font-size: 12px;top:0;left:0;z-index:999;color:#fff;';
						body.appendChild(div)
					} else {
						
						 p2pserver_div.innerHTML = '\u0050\u0032\u0050\u52a0\u901f\u4e2d[\u2193:' +(p2pobj.totalP2PDownloaded ? p2pobj.totalP2PDownloaded : 0) +  'KB\u2191:' + (p2pobj.totalP2PUploaded ? p2pobj.totalP2PUploaded : 0) + 'KB]';
					}
				}
			
}

Get_can();
 function player(api,url,type,device,up) {
 
     $.post(api, { "url": url, "type": type, "from": "mt2t.com", "device": device, "up": up }, ckplayerLoad, "json");
 }

 
  function error(){
   
    var isiPad = navigator.userAgent.match(/iPad|iPhone|Android|Linux|iPod/i) != null;
	if(isiPad){
	    var vod = document.getElementById("videoPlayer");
        if(vod.error!=null)
	    if(vod.error.code==4) play_up();
	}else{
     
        CKobject.getObjectById('ckplayer_a1').addListener('error','play_up');
//       CKobject.getObjectById('ckplayer_a1').addListener('fastNext','fastNextHandler');
// CKobject.getObjectById('ckplayer_a1').addListener('fullScreen','fullscreen');
	}
}
   var errid = 0;
function play_up(){

	errid++;
	if(errid < 4){ //最多只重新加载3次
	    player(api, url, type, device, errid);
	}
}


function checkP2P() {
    try {
        if (RTCPeerConnection) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        return false;
    }
}

function isIE() {
     if (!!window.ActiveXObject || "ActiveXObject" in window){
         return true;
     }else{
         return false;
     }
 }

 (function () {

     var BASE64_MAPPING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

     var __BASE64 = {
         // 解密
         de: function (r) {
             var o = String(r).replace(/=+$/, "");
             if (o.length % 4 == 1) throw new t("'atob' failed: The string to be decoded is not correctly encoded.");
             for (var n, a, i = 0, c = 0, d = ""; a = o.charAt(c++); ~a && (n = i % 4 ? 64 * n + a : a, i++ % 4) ? d += String.fromCharCode(255 & n >> (-2 * i & 6)) : 0) a = BASE64_MAPPING.indexOf(a);
             return d;
         },
         // 加密
         en: function (r) {
             for (var o, n, a = String(r), i = 0, c = BASE64_MAPPING, d = ""; a.charAt(0 | i) || (c = "=", i % 1); d += c.charAt(63 & o >> 8 - i % 1 * 8)) {
                 if (n = a.charCodeAt(i += .75), n > 255) throw new t("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
                 o = o << 8 | n;
             }
             return d;
         }
     };
     window.BASE64 = __BASE64;
 })();

 (function () {
   document.getElementById('show').style.display = 'block';
    document.getElementById('show').onclick = function () {
        document.getElementById('show').style.display = 'none';
        if (dp != null) dp.play();
        var vp = document.getElementById("videoPlayer");
        if (vp != null) vp.play()
    }
     })();
  
