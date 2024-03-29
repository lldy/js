﻿var webtools = {


csrf_qqv:function(vid){
		var time = webtools.gettime();
		var guid = webtools.createGUID();
//		var platform = webtools.getPlatform();
//		var stdfrom = webtools.getStdfrom(platform);
        var platform =  '10201';
         var stdfrom ='v1010';
		webtools.getPushGuid(vid,guid,platform,'');
		$.ajax({
			url:'https://vd.l.qq.com/proxyhttp',
			async:false,
			type:'POST',
			dataType:'json',
			crossDomain:!0,
			xhrFields:{
				withCredentials:!0
			},
			contentType:'text/plain',
			data:JSON.stringify({
				adparam:'',
				buid:'vinfoad',
				vinfoparam:$.param({
					charge:0,
					defaultfmt:'auto',
					otype:'json',
					guid:guid,
					flowid:webtools.createGUID()+'_'+platform,
					platform:platform,
					sdtfrom:stdfrom,
					defnpayver:1,
					appVer:'3.5.41',
					host:'film.qq.com',
					refer:'http://film.qq.com/film_index_prevue/index.html?firstVid='+vid,
					ehost:'http://film.qq.com/film_index_prevue/index.html',
					sphttps:1,
					tm:time,
					spwm:4,
					vid:vid,
					defn:'mp4',
					fhdswitch:0,
					show1080p:0,
					isHLS:1,
					dtype:3,
					defsrc:1,
					encryptVer:webtools.getencrypt(),
					cKey:webtools.ckey7(vid,time,platform)
				})
			}),
			success:function(d){
				var json = webtools.strsub(d.vinfo,'QZOutputJson=','};')+'}';
				json = JSON.parse(json);
				if(json.vl.vi[0].drm == 1){
					platform = '11001';
					var qv = webtools.qv(platform,vid,stdfrom,1,time);
					$.ajax({
						url:'https://h5vv.video.qq.com/getinfo',
						async:false,
						dataType:'jsonp',
						jsonpCallback:'jsonp'+time,
						data:{
							charge:0,
							defaultfmt:'auto',
							otype:'json',
							guid:guid,
							flowid:webtools.createGUID()+'_'+platform,
							platform:platform,
							sdtfrom:stdfrom,
							defnpayver:0,
							appVer:'3.3.367',
							host:'m.v.qq.com',
							ehost:'https://m.v.qq.com/play.html?vid='+vid,
							sphttps:1,
							_rnd:time,
							spwm:4,
							vid:vid,
							defn:'mp4',
							fhdswitch:0,
							show1080p:0,
							isHLS:0,
							fmt:'auto',
							defsrc:1,
							dtype:1,
							clip:4,
							sphls:0,
							_qv_rmt:qv.u1,
							_qv_rmt2:qv.u2
						},
						success:function(d){
                        try
                          {
							var url = d.vl.vi[0].ul.ui[0].url+d.vl.vi[0].fn+'?sdtfrom='+stdfrom+'&guid='+guid+'&vkey='+d.vl.vi[0].fvkey.substring(0,64)+'&platform=2';
							webtools.getPushGuid(vid,guid,platform,url);
							  var data={ext:'dmp4',msg:'ok',url:url};
                        Dplayer_Load(data);
                        }
                        catch(err)
                        {
                       
                        	  var data={ext:'dmp4',msg:'请稍后......',url:""};
                        ckplayerLoad(data);
                        return;
                        }
						}
					});
				}else{
					if(json.dltype == 3){
						var url = json.vl.vi[0].ul.ui[0].url+json.vl.vi[0].ul.ui[0].hls.pt;
						url = url.replace('ltsdl.qq.com','stsws.qq.com');
						webtools.getPushGuid(vid,guid,platform,url);
                          var data={ext:'dm3u8',msg:'ok',url:url};
                        Dplayer_Load(data);
						
					}else if(json.dltype == 1){
						var url = json.vl.vi[0].ul.ui[0].url+json.vl.vi[0].fn+'?sdtfrom='+stdfrom+'&guid='+guid+'&vkey='+json.vl.vi[0].fvkey+'&platform=2';
						webtools.getPushGuid(vid,guid,platform,url);
                        var data={ext:'dmp4',msg:'ok',url:url};
                        Dplayer_Load(data);
						
					}
				}
			}
		});
	},
	getStdfrom: function(a,c){
        if(!c){c='v.qq.com';}
		if (a && "70201" == a) return "v1104";
		if (a && "70901" == a) return "v1103";
		if (a && "3670201" == a) return "v1105";
		var b = "view.inews.qq.com" === b,
		c = c.indexOf("caixin.com") > -1;
		return c ? "v1093": this.useragent().mobile || "ke.qq.com" !== c ? this.useragent().os.iphone || this.useragent().os.ipod ? b ? "v3110": "v3010": this.useragent().os.ipad ? b ? "v4110": "v4010": this.useragent().os.android ? this.useragent().os.tablet ? "v6010": b ? "v5110": "v5010": this.useragent().browser.IEMobile ? "v7010": "v1010": "v1101"
	},
    dateFormat:function(a){
		var b = new Date(),
		a = a || "yyyy-MM-dd hh:mm:ss";
		var c = {
			"M+": b.getMonth() + 1,
			"d+": b.getDate(),
			"h+": b.getHours(),
			"m+": b.getMinutes(),
			"s+": b.getSeconds(),
			"q+": Math.floor((b.getMonth() + 3) / 3),
			S: b.getMilliseconds()
		};
		/(y+)/.test(a) && (a = a.replace(RegExp.$1, (b.getFullYear() + "").substr(4 - RegExp.$1.length)));
		for (var d in c) new RegExp("(" + d + ")").test(a) && (a = a.replace(RegExp.$1, 1 == RegExp.$1.length ? c[d] : ("00" + c[d]).substr(("" + c[d]).length)));
		return a
	},
	getPushGuid:function(vid,guid,platform,url){
		var reportUrls = new Array(),
			ctime = this.dateFormat("yyyy-MM-dd hh:mm S");
		if(url == ''){
			reportUrls.push("//tj.video.qq.com/fcgi-bin/set_cookie?"+$.param({
				lv_irt_id:'',
				dm:'v.qq.com',
				ua:navigator.userAgent,
				r:'',
				vid:vid,
				sr:'1600x900',
				ul:'zh-CN',
				tv:'0.0.7',
				pt:'腾讯视频',
				guid:guid,
				url:'http://film.qq.com/film_index_prevue/index.html?firstVid='+vid,
				from:'http://film.qq.com/film_index_prevue/index.html?firstVid='+vid,
				playing_url:''
			}));
			reportUrls.push("//btrace.video.qq.com/kvcollect?"+$.param({
				BossId:'3717',
				Pwd:'1055758521',
				version:'3.3.367',
				uid:guid,
				pid:guid,
				vid:vid,
				player_type:'h5',
				video_type:1,
				platform:platform,
				usr_action:'pause',
				usr_action_detail:'',
				url:'http://film.qq.com/film_index_prevue/index.html?firstVid='+vid,
				vid:vid,
				ptag:'v.qq.com#v.play.adaptor#2',
				mreferrer:'https://v.qq.com/',
				start:0
			}));
			reportUrls.push("//btrace.video.qq.com/kvcollect?BossId=4501&Pwd=142347456&loginid=&loginex=&logintype=0&guid="+guid+"&longitude=&latitude=&vip=0&online=1&p2p=0&downloadkit=0&resolution=1280*720*1.5&testid=&osver=windows+10.0&playerver=&playertype=1&uip=&confid=&cdnip=&cdnid=&cdnuip=&freetype=&sstrength=&network=&speed=&device=&appver=3.3.367&p2pver=&url=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Flqp2m6v1m450l3n.html&refer=&ua=Mozilla%2F5.0+(Windows+NT+10.0%3B+WOW64)+AppleWebKit%2F537.36+(KHTML++like+Gecko)+Chrome%2F55.0.2883.87+Safari%2F537.36&ptag=&flowid="+guid+"_"+platform+"&platform="+platform+"&dltype=1&vid="+vid+"&fmt=&rate=&clip=&status=&type=&duration=&data=%7B%22code%22%3A%22%22%2C%22stime%22%3A1508894110924%7D&step=0&seq=0");
            reportUrls.push("//btrace.video.qq.com/kvcollect?BossId=4501&Pwd=142347456&loginid=&loginex=&logintype=0&guid="+guid+"&longitude=&latitude=&vip=0&online=1&p2p=0&downloadkit=0&resolution=1280*720*1.5&testid=&osver=windows+10.0&playerver=&playertype=1&uip=&confid=&cdnip=&cdnid=&cdnuip=&freetype=&sstrength=&network=&speed=&device=&appver=3.3.367&p2pver=&url=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Flqp2m6v1m450l3n.html&refer=&ua=Mozilla%2F5.0+(Windows+NT+10.0%3B+WOW64)+AppleWebKit%2F537.36+(KHTML++like+Gecko)+Chrome%2F55.0.2883.87+Safari%2F537.36&ptag=&flowid="+guid+"_"+platform+"&platform="+platform+"&dltype=1&vid="+vid+"&fmt=&rate=&clip=&status=&type=&duration=&data=%7B%22stime%22%3A1508894111146%2C%22etime%22%3A1508894111834%2C%22code%22%3A%22%22%7D&step=5&seq=1");
            reportUrls.push("//btrace.video.qq.com/kvcollect?BossId=4298&Pwd=686148428&uin=&vid="+vid+"&coverid=&pid="+guid+"&guid="+guid+"&unid=&vt=&type=&url=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Flqp2m6v1m450l3n.html&bi=&bt=&version=3.3.367&platform="+platform+"&format=&defn=&ctime="+ctime+"&ptag=&isvip=0&tpid=1&pversion=chromehls&hc_uin=&hc_main_login=&hc_vuserid=&hc_openid=&hc_appid=&hc_pvid=494205040&hc_ssid=&hc_qq=&hh_ua=Mozilla%2F5.0+(Windows+NT+10.0%3B+WOW64)+AppleWebKit%2F537.36+(KHTML++like+Gecko)+Chrome%2F55.0.2883.87+Safari%2F537.36&ckey=&iformat=&hh_ref=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Flqp2m6v1m450l3n.html&vurl=&v_idx=0&rcd_info=&extrainfo=&step=3&val=1&idx=0&diagonal=1009&isfocustab=1&isvisible=1");
		}else{
			reportUrls.push("//btrace.video.qq.com/kvcollect?"+$.param({
				BossId:'2865',
				Pwd:'1698957057',
				_dc:0,
				version:'TenPlayerHTML5V2.0',
				vid:vid,
				rid:webtools.createGUID(),
				pid:webtools.createGUID(),
				url:'http://film.qq.com/film_index_prevue/index.html?firstVid='+vid,
				platform:platform,
				pfversion:'9.1',
				vt:203,
				tpid:9,
				vurl:url,
				bt:5905,
				step:3,
				ctime:ctime,
				val:1,
				isshortvd:0,
				opensource:0,
				cmid:webtools.createGUID(),
				ua:navigator.userAgent
			}));
		}
		for (var i=0;i<reportUrls.length;i++)
			webtools.setimg(reportUrls[i]);
    },
	useragent:function(a){
        var a = a || navigator.userAgent,
        a = a.toLowerCase(),
        browser = {},
        os = {},
        phone = {},
        mobile = !1;
        a.indexOf("mobile") > -1 && (mobile = !0);
        var b, c, d = {
            android_1: /android[\s\/]([\d\.]+)/i,
            android_2: /android/i,
            android_3: /MIDP-/i,
            ipod_1: /iPod\stouch;\sCPU\siPhone\sos\s([\d_]+)/i,
            ipod_100: /iPod.*os\s?([\d_\.]+)/i,
            iphone: /iPhone;\sCPU\siPhone\sos\s([\d_]+)/i,
            iphone_100: /iPhone.*os\s?([\d_\.]+)/i,
            ipad_1: /ipad;\scpu\sos\s([\d_]+)/i,
            ipad_2: /ipad([\d]+)?/i,
            windows: /windows\snt\s([\d\.]+)/i,
            mac: /Macintosh.*mac\sos\sx\s([\d_\.]+)/i,
            linux: /Linux/i
        };
        for (var e in d) if (b = d[e].exec(a)) {
            c = e.replace(/_\d+/, ""),
            os[c] = !0,
            os.name = c,
            b[1] && (os.version = b[1].replace(/_/g, "."));
            break
        } (os.iphone || os.ipad || os.ipod) && (os.ios = !0);
        var f, g, h = {
            wechat: /MicroMessenger\/([\d\.]+)/i,
            ipadqq: /IPadQQ\/([\d\.]+)/i,
            mqq: /qq\/([\d\.]+)/i,
            qzone: /QZONEJSSDK\/([\d\.]+)/i,
            mqqbrowser: /mqqbrowser\/([\d\.]+)/i,
            qqbrowser: /[^m]QQBrowser\/([\d\.]+)/i,
            x5: /tbs\/(\d+)/i,
            uc: /UCBrowser\/([\d\.]+)/i,
            safari_1: /Version\/(([\d\.]+))\sSafari\/[\d\.]+/i,
            safari_2: /Safari\/([\d\.]+)/i,
            firefox: /Firefox\/([\d\.]+)/i,
            opera: /OPR\/([\d\.]+)/i,
            ie_1: /MSIE\s([\d\.]+)/i,
            ie_2: /(trident\/\d\.\d)/i,
            ie_3: /(Edge)\/\d+\.\d+/i,
            weibo: /weibo__([\d\.]+)/i,
            qqnews: /qqnews\/([\d\.]+)/i,
            qqlive_1: /QQLiveBrowser\/([\d\.]+)/i,
            qqlive_2: /QQLiveHDBrowser\/([\d\.]+)/i,
            kuaibao: /qnreading\/([\d\.]+)/i,
            liebao: /LieBaoFast\/([\d\.]+)/i,
            douban: /com\.douban\.frodo\/([\d\.]+)/i,
            miuibrowser: /MiuiBrowser/i,
            baidu: /baiduboxapp/i,
            browser360: /360browser/i,
            oppobrowser: /OppoBrowser/i,
            chrome_1: /CriOS\/([\d\.]+)/i,
            chrome_2: /Chrome\/([\d\.]+)/i,
            qqdownloader: /qqdownloader\/([\d\.]+)/i
        };
        for (var i in h) if (f = h[i].exec(a)) {
            if (g = i.replace(/_\d+/, ""), browser[g]) return;
            browser[g] = {
                version: f[1]
            }
        }
        os.android && browser.safari && delete browser.safari,
        browser.chrome && browser.safari && delete browser.safari,
        browser.ie && browser.ie.version && browser.ie.version.indexOf("trident") > -1 && (browser.ie.version.indexOf("6.0") > -1 ? browser.ie.version = "10": browser.ie.version.indexOf("5.0") > -1 ? browser.ie.version = "9": browser.ie.version.indexOf("4.0") > -1 ? browser.ie.version = "8": browser.ie.version = "11");
        var j, k = {
            ipod: /iPod/i,
            ipad: /iPad/i,
            iphone: /iPhone/i,
            wp:/Windows Phone ([\d.]+)/,
            huawei_1: /HUAWEI([\w_-]+)/i,
            huawei_2: /(CHM-\w+)/i,
            huawei_3: /(HonorChe)/i,
            huawei_4: /HONORPLK/i,
            huawei_5: /(Che\d+-CL\d+)/i,
            huawei_6: /(H\d+-L\d+)/i,
            huawei_100: /HUAWEI/i,
            xiaomi_1: /(HM\sNOTE)/i,
            xiaomi_2: /(HM\s\w+)/i,
            xiaomi_3: /(MI\s\w+)/i,
            xiaomi_4: /(MI-ONE\sPlus)/i,
            xiaomi_5: /(M1)\sBuild/i,
            xiaomi_6: /(HM\d+)/i,
            xiaomi_7: /Xiaomi[\s_]?([\w_]+)/i,
            samsung_1: /(GT-\w+)/i,
            samsung_2: /(SCH-\w+)/i,
            samsung_3: /(SM-\w+)/i,
            vivo: /vivo\s(\w+)/i,
            oneplus: /ONEPLUS-([a-z0-9]+)/i,
            lenovo_1: /Lenovo[\s-]?([\w-]+)/i,
            lenovo_100: /Lenovo/i,
            zte_1: /ZTE\s?(\w+)?/i,
            zte_2: /ZTE/i,
            coolpad_1: /Coolpad\s(\w+)/i,
            coolpad_100: /Coolpad/i,
            oppo_1: /OPPO\s?(\w+)/i,
            oppo_2: /(R7Plus|R8007|R801|R831S|R8205)/i,
            oppo_100: /OPPO/i,
            meizu_1: /(MX\d+)/i,
            meizu_2: /(m\d+\snote)\sBuild/i,
            htc_1: /HTC\s?(\w+)/i,
            htc_100: /HTC/i,
            tcl: /TCL\s(\w+)/i,
            lephone: /lephone\s(\w+)/i,
            lg: /LG[\s-]?(\w+)/i,
            galaxy: /(galaxy\d+)/,
            hisense_1: /Hisense/i,
            hisense_2: /HS-(\w+)/i,
            philips: /Philips\s?(\w+)?/i,
            "é‡‘ç«‹": /(GN\w+)\sBuild/i,
            sonny: /sonny/i,
            "å¤©è¯­": /K-Touch/i,
            "MiPad":/XiaoMi\/MiPad/i,
            "lepad":/lepad/i,
            yoga:/YOGA/i,
            mediapad:/MediaPad/i,
            gtp:/GT-P/i,
            smt:/SM-T/i,
            gt_n5100:/GT-N5100/i,
            sch_i800:/sch-i800/i,
            "huawei":/HUAWEI\s?[MTS]\d+-\w/i,
            nexus_s7:/Nexus\s7/i,
            nexus_s8:/Nexus\s8/i,
            nexus_s11:/Nexus\s11/i,
            "Kindle_Fire":/Kindle Fire HD/i,
            Tablet:/Tablet/i,
            samsung_tab:/tab/i
        };
        for (var l in k) if (j = k[l].exec(a)) {
            phone.name = l.replace(/_\d+/, ""),
            j[1] && (phone.version = j[1].replace(/^[_-]/gi, ""));
            break
        }
        return {
            browser : browser,
            os      : os,
            phone   : phone,
            mobile  : mobile,
            mac     : /mac/i.test(a)
        };
    },
	getBusinessId:function(){
		var d = this.useragent();
		if (d.browser.wechat) return 6;
		if (d.browser.mqq) return 17;
		var a = "";
		if (document.location.href.indexOf("http://v.qq.com/iframe/") >= 0 && window != top) {
			var b = document.referrer;
			if ("" !== b) {
				var c = document.createElement("a");
				c.href = b,
				a = c.hostname,
				c = null
			}
		}
		"" === a && (a = 'v.qq.com');
		var e = [{
			r: /(\w+\.)?weixin\.qq\.com$/i,
			v: 6
		},
		{
			r: /^(v|film)\.qq\.com$/i,
			v: 1
		},
		{
			r: /^news\.qq\.com$/i,
			v: 2
		},
		{
			r: /(\w+\.)?qzone\.qq\.com$/i,
			v: 3
		},
		{
			r: /(\w+\.)?t\.qq\.com$/i,
			v: 5
		},
		{
			r: /^3g\.v\.qq\.com$/i,
			v: 8
		},
		{
			r: /^m\.v\.qq\.com$/i,
			v: 10
		},
		{
			r: /3g\.qq\.com$/i,
			v: 12
		}];
		a = a.toLowerCase();
		for (var f = 0,
		g = e.length; f < g; f++) {
			var h = e[f];
			if (h.r.test(a)) return h.v
		}
		return 7
	},
	getPlatform:function(){
		var a = this.getBusinessId(),
			b = this.getDeviceId();
		return 1e4 * a + 100 * b + 1
	},
	getDeviceId:function(){
		var a = navigator.userAgent,d = this.useragent();
		return d.os.ipad ? 1 : d.os.windows ? /Touch/i.test(a) ? 8 : /Phone/i.test(a) ? 7 : 2 : d.os.android ? d.mobile ? 3 : 5 : d.os.iphone ? 4 : d.os.mac ? 9 : 10
	},
	strsub:function(str,start,end){
		var s = str.indexOf(start) + start.length;
		var e = str.indexOf(end,s);
		return str.substring(s,e);
	},
	tempcalc : function(a, b){
		for (var c = "",d = 0; d < a.length; d++)
			c += String.fromCharCode(a.charCodeAt(d) ^ b.charCodeAt(d % 4));
		return c
	},
	u1: function(a, b){
		for (var c = "",d = b; d < a.length; d += 2)
			c += a.charAt(d);
		return c
	},
    urlenc : function(a, b, d) {
		var _urlStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		for (var e, f, g, h, i, j, k, l = "",
		m = 0; m < a.length;) e = a.charCodeAt(m++),
		f = a.charCodeAt(m++),
		g = a.charCodeAt(m++),
		15 == m && (l += "A", l += b, l += d),
		h = e >> 2,
		i = (3 & e) << 4 | f >> 4,
		j = (15 & f) << 2 | g >> 6,
		k = 63 & g,
		isNaN(f) ? j = k = 64 : isNaN(g) && (k = 64),
		l = l + _urlStr.charAt(h) + _urlStr.charAt(i) + _urlStr.charAt(j) + _urlStr.charAt(k);
		return l
	},
	qv:function(a, b, d, e, f){
		f = f || parseInt( + new Date / 1e3),
		e = ("" + e).charAt(0);
		var g = "",
		h = "",
		i = {
			plt: a || "",
			vid: b || "",
			std: d || "",
			sts: e || "",
			ts: f,
			rf: g,
			ua: h
		};
		i = window.JSON ? JSON.stringify(i) : function(){
			var a = [];
			for (var b in i) a.push('"' + b + '":"' + i[b] + '"');
			return "{" + a.join(",") + "}"
		}(i);
		var j = this.hexToString(md5(a + b + f + "#$#@#*ad" + g + h + e.charAt(0) + d)),
			k = this.urlenc(this.tempcalc(j, "#$#@#*ad"), e.charAt(0), f),
			l = this.urlenc(this.tempcalc(j, "86FG@hdf"), e.charAt(0), f),
			m = this.u1(k, 0),
			n = this.u1(k, 1);
		return {
			p: i,
			u: k,
			c: l,
			u1: m,
			u2: n,
			t: f
		}
	},
	hexToString: function(a){
		for (var b = "",c = "0x" == a.substr(0, 2) ? 2 : 0; c < a.length; c += 2)
			b += String.fromCharCode(parseInt(a.substr(c, 2), 16));
		return b
	},
	gettime:function(){
		return parseInt(new Date().getTime()/1000);
	},
	notempty:function(ary){
		return ary.filter(t => t!=undefined && t!==null);
	},
	getencrypt:function(){
		var day = new Date().getDay(),
			g = (day == 0 ? 7 : day);
		return '7.'+g;
	},
	ckey7:function(vid,tm,platform){
		var day = new Date().getDay(),
			g = (day == 0 ? 7 : day),
			magic='';
		if( g == 1 ){
			magic = "06fc1464";
		} else if( g == 2 ){
			magic = "4244ce1b";
		} else if( g == 3 ){
			magic = "77de31c5";
		} else if( g == 4 ){
			magic = "e0149fa2";
		} else if( g == 5 ){
			magic = "60394ced";
		} else if( g == 6 ){
			magic = "2da639f0";
		} else if( g == 7 ){
			magic = "c2f0cf9f";
		}
		return md5(magic + vid + tm + "*#06#" + platform);
	},
	createGUID:function(a){
		a = a || 32;
		for (var b = "",c = 1; c <= a; c++){
			var d = Math.floor(16 * Math.random()).toString(16);
			b += d
		}
		return b
	},
     setimg:function(url){
      $('body').append('<img style="display:none;" src="'+url+'" />'); 
//   var r1 = document.createElement("img");
//                r1.src = url;
      }






}