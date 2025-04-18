var adBreak = function() {};
"remove"in Element.prototype || (Element.prototype.remove = function() {
    this.parentNode && this.parentNode.removeChild(this)
}
);
var CSSlink = document.createElement("link");
CSSlink.href = "https://lagged.com/js/plus/game2.css",
CSSlink.rel = "stylesheet",
CSSlink.media = "screen",
document.getElementsByTagName("head")[0].appendChild(CSSlink);
var hsData, isMobile, LaggedAPI = {};
!function() {
    function E(a, n) {
        T.getElementById("createloginBtnMain").disabled = !0;
        var d = T.getElementById("createloginBtnMain").innerText;
        T.getElementById("createloginBtnMain").innerText = "Loading...",
        T.getElementById("createloginBtnMain").className += " btnloading",
        T.getElementById("errorsubmit") && T.getElementById("errorsubmit").remove();
        var e, t, r, o, i = "", l = !1, c = [];
        return "login" != a && (T.getElementById("inputEmail1") && (i = T.getElementById("inputEmail1").value),
        (i.length < 2 || 30 < i.length) && (l = !0,
        c.push("Nickname must be between 2-30 characters"))),
        (e = T.getElementById("inputEmail2").value).length < 5 && (l = !0,
        c.push("Please enter a valid email address")),
        ((t = T.getElementById("inputEmail3").value).length < 6 || 30 < t.length) && (l = !0,
        c.push("Password must be between 6-30 characters")),
        l ? (T.getElementById("createloginBtnMain").innerText = d,
        T.getElementById("createloginBtnMain").classList.remove("btnloading"),
        T.getElementById("createloginBtnMain").disabled = !1,
        (o = document.createElement("div")).id = "errorsubmit",
        o.className = "error_msg",
        r = document.createTextNode(c[0]),
        o.appendChild(r),
        T.getElementById("signupFormWrap").insertBefore(o, T.getElementById("loginit"))) : ((r = new XMLHttpRequest).onreadystatechange = function() {
            var e, t;
            4 == this.readyState && 200 == this.status && (t = (t = this.responseText).replace(")]}',", ""),
            !0 === (t = JSON.parse(t)).success && 0 < t.uid ? (T.getElementById("createloginBtnMain").innerText = "Success!",
            T.getElementById("createloginBtnMain").className += " btnSuccessMsg",
            window.parent.showUserInfo(t),
            setTimeout(function() {
                T.getElementById("createloginBtnMain").className = "main_hs_btn viewranks btnSuccessMsg",
                s(T.getElementById("leaderboard-modal")),
                setTimeout(function() {
                    T.getElementById("leaderboard-wrapper").remove()
                }, 200),
                setTimeout(function() {
                    T.getElementById("leaderboard-modal").remove(),
                    n && LaggedAPI.Scores.load(m, a)
                }, 300)
            }, 600)) : (T.getElementById("createloginBtnMain").innerText = d,
            T.getElementById("createloginBtnMain").className = "main_hs_btn viewranks",
            T.getElementById("createloginBtnMain").disabled = !1,
            (e = document.createElement("div")).id = "errorsubmit",
            e.className = "error_msg",
            t = document.createTextNode(t.errors),
            e.appendChild(t),
            T.getElementById("signupFormWrap").insertBefore(e, T.getElementById("loginit"))))
        }
        ,
        (o = {
            fnickname: null
        }).ftype = a,
        i && (o.fnickname = encodeURIComponent(i)),
        o.femail = encodeURIComponent(e),
        o.fpass = encodeURIComponent(t),
        r.open("POST", "//lagged.com/api/v3/ajax.php", !0),
        r.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
        r.send("ftype=" + o.ftype + "&fnickname=" + o.fnickname + "&femail=" + o.femail + "&fpass=" + o.fpass)),
        !1
    }
    function s(e) {
        var t = 1;
        a = setInterval(function() {
            if (t <= .1) {
                clearInterval(a);
                try {
                    e.style.display = "none"
                } catch (e) {
                    console.log(e)
                }
            }
            try {
                e.style.opacity = t,
                e.style.filter = "alpha(opacity=" + 100 * t + ")"
            } catch (e) {
                console.log(e)
            }
            t -= .1 * t
        }, 13)
    }
    function B(e) {
        return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    }
    function k(e) {
        return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    function I(e) {
        if (999 < e)
            return k(e);
        if (99 < e)
            return e;
        var t = e % 10
          , a = e % 100;
        return 1 == t && 11 != a ? e + "st" : 2 == t && 12 != a ? e + "nd" : 3 == t && 13 != a ? e + "rd" : e + "th"
    }
    function C() {
        s(T.getElementById("leaderboard-loading")),
        setTimeout(function() {
            T.getElementById("leaderboard-loading").remove()
        }, 200)
    }
    function N(e) {
        p = window.parent.isFullscreen,
        T = p ? document : window.parent.document,
        e || ((a = document.createElement("div")).id = "leaderboard-modal",
        a.onclick = function(e) {
            return e.preventDefault(),
            e.stopPropagation(),
            !1
        }
        ,
        T.body.appendChild(a));
        var t = document.createElement("div");
        t.id = "leaderboard-loading",
        t.className = "leaderboard-circle";
        var e = Math.max(document.documentElement.clientHeight, window.parent.innerHeight || 0)
          , a = window.parent.innerWidth;
        a < 769 && 599 < a && 719 < e && t.setAttribute("style", "top:calc(" + e + "px/2 - 249px)"),
        T.body.appendChild(t)
    }
    function o(e, t, a, n, d, r) {
        var o = new XMLHttpRequest;
        o.onreadystatechange = function() {
            var e;
            4 == this.readyState && 200 == this.status ? (e = (e = this.responseText).replace(")]}',", ""),
            e = JSON.parse(e),
            d(e, r)) : 4 == this.readyState && d(e = {
                success: !1
            }, r)
        }
        ;
        t = "//lagged.com/api/v3/ajax_" + t + ".php";
        o.open("POST", t, !0),
        o.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
        o.send("type=" + e + "&action=" + a + "&data=" + n)
    }
    var l, m, T, c = new function() {
        function i(e, t) {
            return (e >>> 1 | t >>> 1) << 1 | 1 & e | 1 & t
        }
        function l(e, t) {
            return (e >>> 1 ^ t >>> 1) << 1 | 1 & e ^ 1 & t
        }
        function c(e, t) {
            return (e >>> 1 & t >>> 1) << 1 | 1 & e & t
        }
        function m(e, t) {
            var a = (65535 & e) + (65535 & t);
            return (e >> 16) + (t >> 16) + (a >> 16) << 16 | 65535 & a
        }
        function p(e) {
            for (var t = "", a = 0; a <= 3; a++)
                t += n.charAt(e >> 8 * a + 4 & 15) + n.charAt(e >> 8 * a & 15);
            return t
        }
        function s(e, t, a, n, d, r) {
            return m((r = m(m(t, e), m(n, r))) << d | r >>> 32 - d, a)
        }
        function u(e, t, a, n, d, r, o) {
            return s(i(c(t, a), c(~t, n)), e, t, d, r, o)
        }
        function g(e, t, a, n, d, r, o) {
            return s(i(c(t, n), c(a, ~n)), e, t, d, r, o)
        }
        function h(e, t, a, n, d, r, o) {
            return s(l(l(t, a), n), e, t, d, r, o)
        }
        function b(e, t, a, n, d, r, o) {
            return s(l(a, i(t, ~n)), e, t, d, r, o)
        }
        var v = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
          , n = "0123456789abcdef";
        return {
            base64: function(e) {
                var t, a, n, d, r, o, i = "", l = 0;
                for (e = function(e) {
                    if (!e)
                        return "";
                    e = e.replace(/\r\n/g, "\n");
                    for (var t = "", a = 0; a < e.length; a++) {
                        var n = e.charCodeAt(a);
                        n < 128 ? t += String.fromCharCode(n) : (127 < n && n < 2048 ? t += String.fromCharCode(n >> 6 | 192) : (t += String.fromCharCode(n >> 12 | 224),
                        t += String.fromCharCode(n >> 6 & 63 | 128)),
                        t += String.fromCharCode(63 & n | 128))
                    }
                    return t
                }(e); l < e.length; )
                    n = (o = e.charCodeAt(l++)) >> 2,
                    d = (3 & o) << 4 | (t = e.charCodeAt(l++)) >> 4,
                    r = (15 & t) << 2 | (a = e.charCodeAt(l++)) >> 6,
                    o = 63 & a,
                    isNaN(t) ? r = o = 64 : isNaN(a) && (o = 64),
                    i = i + v.charAt(n) + v.charAt(d) + v.charAt(r) + v.charAt(o);
                return i
            },
            md5: function(e) {
                for (var t = function(e) {
                    for (var t = 1 + (e.length + 8 >> 6), a = new Array(16 * t), n = 0; n < 16 * t; n++)
                        a[n] = 0;
                    for (n = 0; n < e.length; n++)
                        a[n >> 2] |= e.charCodeAt(n) << (8 * e.length + n) % 4 * 8;
                    a[n >> 2] |= 128 << (8 * e.length + n) % 4 * 8;
                    var d = 8 * e.length;
                    return a[16 * t - 2] = 255 & d,
                    a[16 * t - 2] |= (d >>> 8 & 255) << 8,
                    a[16 * t - 2] |= (d >>> 16 & 255) << 16,
                    a[16 * t - 2] |= (d >>> 24 & 255) << 24,
                    a
                }(e), a = 1732584193, n = -271733879, d = -1732584194, r = 271733878, o = 0; o < t.length; o += 16) {
                    var i = a
                      , l = n
                      , c = d
                      , s = r
                      , n = b(n = b(n = b(n = b(n = h(n = h(n = h(n = h(n = g(n = g(n = g(n = g(n = u(n = u(n = u(n = u(n, d = u(d, r = u(r, a = u(a, n, d, r, t[o + 0], 7, -680876936), n, d, t[o + 1], 12, -389564586), a, n, t[o + 2], 17, 606105819), r, a, t[o + 3], 22, -1044525330), d = u(d, r = u(r, a = u(a, n, d, r, t[o + 4], 7, -176418897), n, d, t[o + 5], 12, 1200080426), a, n, t[o + 6], 17, -1473231341), r, a, t[o + 7], 22, -45705983), d = u(d, r = u(r, a = u(a, n, d, r, t[o + 8], 7, 1770035416), n, d, t[o + 9], 12, -1958414417), a, n, t[o + 10], 17, -42063), r, a, t[o + 11], 22, -1990404162), d = u(d, r = u(r, a = u(a, n, d, r, t[o + 12], 7, 1804603682), n, d, t[o + 13], 12, -40341101), a, n, t[o + 14], 17, -1502002290), r, a, t[o + 15], 22, 1236535329), d = g(d, r = g(r, a = g(a, n, d, r, t[o + 1], 5, -165796510), n, d, t[o + 6], 9, -1069501632), a, n, t[o + 11], 14, 643717713), r, a, t[o + 0], 20, -373897302), d = g(d, r = g(r, a = g(a, n, d, r, t[o + 5], 5, -701558691), n, d, t[o + 10], 9, 38016083), a, n, t[o + 15], 14, -660478335), r, a, t[o + 4], 20, -405537848), d = g(d, r = g(r, a = g(a, n, d, r, t[o + 9], 5, 568446438), n, d, t[o + 14], 9, -1019803690), a, n, t[o + 3], 14, -187363961), r, a, t[o + 8], 20, 1163531501), d = g(d, r = g(r, a = g(a, n, d, r, t[o + 13], 5, -1444681467), n, d, t[o + 2], 9, -51403784), a, n, t[o + 7], 14, 1735328473), r, a, t[o + 12], 20, -1926607734), d = h(d, r = h(r, a = h(a, n, d, r, t[o + 5], 4, -378558), n, d, t[o + 8], 11, -2022574463), a, n, t[o + 11], 16, 1839030562), r, a, t[o + 14], 23, -35309556), d = h(d, r = h(r, a = h(a, n, d, r, t[o + 1], 4, -1530992060), n, d, t[o + 4], 11, 1272893353), a, n, t[o + 7], 16, -155497632), r, a, t[o + 10], 23, -1094730640), d = h(d, r = h(r, a = h(a, n, d, r, t[o + 13], 4, 681279174), n, d, t[o + 0], 11, -358537222), a, n, t[o + 3], 16, -722521979), r, a, t[o + 6], 23, 76029189), d = h(d, r = h(r, a = h(a, n, d, r, t[o + 9], 4, -640364487), n, d, t[o + 12], 11, -421815835), a, n, t[o + 15], 16, 530742520), r, a, t[o + 2], 23, -995338651), d = b(d, r = b(r, a = b(a, n, d, r, t[o + 0], 6, -198630844), n, d, t[o + 7], 10, 1126891415), a, n, t[o + 14], 15, -1416354905), r, a, t[o + 5], 21, -57434055), d = b(d, r = b(r, a = b(a, n, d, r, t[o + 12], 6, 1700485571), n, d, t[o + 3], 10, -1894986606), a, n, t[o + 10], 15, -1051523), r, a, t[o + 1], 21, -2054922799), d = b(d, r = b(r, a = b(a, n, d, r, t[o + 8], 6, 1873313359), n, d, t[o + 15], 10, -30611744), a, n, t[o + 6], 15, -1560198380), r, a, t[o + 13], 21, 1309151649), d = b(d, r = b(r, a = b(a, n, d, r, t[o + 4], 6, -145523070), n, d, t[o + 11], 10, -1120210379), a, n, t[o + 2], 15, 718787259), r, a, t[o + 9], 21, -343485551)
                      , a = m(a, i);
                    n = m(n, l),
                    d = m(d, c),
                    r = m(r, s)
                }
                return p(a) + p(n) + p(d) + p(r)
            }
        }
    }
    , _ = !1, S = 0, D = !1, M = 0, R = 0, L = -99999, p = !1, u = !1;
    try {
        T = window.parent.document
    } catch (e) {
        u = !0,
        console.log(e)
    }
    T || (console.log("not on lagged, use event"),
    u = !0);
    try {
        "lagged.com" != document.referrer.split("/")[2] && (u = !0)
    } catch (e) {
        u = !0,
        console.log(e)
    }
    if (!u)
        try {
            void 0 !== window.parent.useLaggedapiembed && window.parent.useLaggedapiembed && (console.log("embed mode"),
            u = !0)
        } catch (e) {
            console.log(e)
        }
    vL = [],
    b = [],
    LaggedAPI.init = function(e, t) {
        l = e
    }
    ,
    LaggedAPI.Achievements = {
        save: function(e, t) {
            for (var n, d, a = 0, r = e.length; a < r; a++)
                -1 === vL.indexOf(e[a]) && (vL.push(e[a]),
                b.push(e[a]));
            0 < b.length ? (n = b.length,
            d = t,
            setTimeout(function() {
                if (b.length > n)
                    d({
                        success: !0
                    });
                else {
                    var e = {
                        action: "save"
                    };
                    e.publickey = l,
                    e.awards = b,
                    b = [];
                    var t = JSON.stringify(e)
                      , a = c.base64(t);
                    if (u)
                        try {
                            window.parent.postMessage("awards|" + a, "*"),
                            d({
                                success: !0
                            })
                        } catch (e) {
                            console.log(e)
                        }
                    else
                        o("award", "award", "save", a, g, d)
                }
            }, 35)) : t({
                success: !0
            })
        },
        show: function() {
            try {
                window.parent.openAwards()
            } catch (e) {
                try {
                    window.parent.postMessage("openAwards", "*")
                } catch (e) {
                    console.log(e)
                }
            }
        }
    },
    LaggedAPI.Scores = {
        save: function(e, t) {
            m = e.board,
            u || N(!1);
            var a = {
                action: "save"
            };
            a.publickey = l,
            a.board = e.board,
            a.score = e.score;
            var a = JSON.stringify(a)
              , n = c.base64(a);
            if (u)
                try {
                    window.parent.postMessage("savescore|" + n, "*"),
                    t({
                        success: !0
                    })
                } catch (e) {
                    console.log(e)
                }
            else
                o("highscore", "hs2_p1", "save", n, d, t)
        },
        load: function(e, t) {
            if (u)
                try {
                    window.parent.postMessage("loadscores", "*"),
                    t({
                        success: !0
                    })
                } catch (e) {
                    console.log(e)
                }
            else {
                N(!1);
                var a = {
                    action: "load"
                };
                a.publickey = l,
                a.board = e;
                a = JSON.stringify(a);
                o("highscore", "hs2_p1", "load", c.base64(a), d, n(t))
            }
        }
    };
    var g = function(e, t) {
        var a = {
            success: !0
        };
        e && !0 === e.success ? !0 === e.data.show && r(e.data.achdata, e.user) : (alert("Error: Achievment did not save!"),
        console.log(e),
        a.success = !1,
        a.errormsg = "Error: Achievment did not save!"),
        t && t(a)
    }
      , d = function(e, t) {
        var a = {
            success: !0
        };
        e && !0 === e.success ? (hsData = e,
        function() {
            S = 0,
            D = _ = !1;
            var e = document.createElement("div");
            e.id = "leaderboard-wrapper";
            var t = Math.max(document.documentElement.clientHeight, window.parent.innerHeight || 0)
              , a = window.parent.innerWidth;
            710 < t ? e.setAttribute("style", "margin:calc((" + t + "px - 710px)/2) 0 0 calc((100vw - 688px)/2);") : e.setAttribute("style", "height:" + t + "px;margin:0 0 0 calc((100vw - 688px)/2);"),
            599 < a && a < 769 && 719 < t ? e.setAttribute("style", "margin:calc(" + t + "px/2 - 355px) 0 0;") : a < 601 && e.setAttribute("style", "margin:0;height:100%"),
            a < 1205 && t < 501 && e.setAttribute("style", "margin:0;height:100%");
            var n = document.createElement("div");
            n.id = "leaderboard-wrapper-header";
            var d, r, o, l, c, s, m = document.createElement("button");
            m.onclick = function() {
                T.getElementById("leaderboard-wrapper") && T.getElementById("leaderboard-wrapper").remove(),
                T.getElementById("leaderboard-modal") && (T.getElementById("leaderboard-modal").onclick = "",
                T.getElementById("leaderboard-modal").remove())
            }
            ,
            m.id = "leaderboard-header-button",
            (a = document.createElement("a")).setAttribute("href", "https://lagged.com"),
            a.setAttribute("target", "_blank"),
            a.id = "headerlogolink",
            (t = document.createElement("div")).id = "score-circle",
            t.className = "leaderboard-circle",
            n.appendChild(m),
            n.appendChild(a),
            e.appendChild(n),
            hsData.data && !hsData.data.login ? ((d = document.createElement("div")).className = "yourscore_txtdiv",
            r = document.createTextNode("Your High Score"),
            d.appendChild(r),
            (o = document.createElement("div")).className = "finalscore_divtxt",
            l = document.createTextNode(k(hsData.data.utop.score)),
            o.appendChild(l),
            t.appendChild(d),
            t.appendChild(o),
            e.appendChild(t),
            (n = document.createElement("div")).className = "signup_txti",
            (c = document.createElement("button")).onclick = function() {
                var e, t;
                0 < hsData.data.gamedata.id && (N(!0),
                (e = new XMLHttpRequest).onreadystatechange = function() {
                    var e;
                    4 == this.readyState && 200 == this.status ? (e = (e = this.responseText).replace(")]}',", ""),
                    e = JSON.parse(e),
                    hsData.data.scoredata = e.data.scoredata,
                    C(),
                    function e(t, a) {
                        "leader" === t && a ? (T.getElementById("score-circle").remove(),
                        T.getElementsByClassName("signup_txti")[1].remove(),
                        T.getElementsByClassName("signup_txti")[0].remove(),
                        T.getElementsByClassName("moregames_wrapper")[0].remove(),
                        T.getElementsByClassName("main_hs_btn")[0].remove(),
                        T.getElementById("headerlogolink").remove()) : T.getElementById("leaderboardRankingWrap").remove(),
                        a && ((l = document.createElement("div")).className = "gameThumbTitleWrap",
                        (d = document.createElement("a")).setAttribute("href", "https://lagged.com/en/g/" + hsData.data.gamedata.url_key),
                        d.setAttribute("title", hsData.data.gamedata.name),
                        d.setAttribute("target", "_blank"),
                        l.appendChild(d),
                        (n = document.createElement("img")).setAttribute("src", "https://imgs2.dab3games.com/" + hsData.data.gamedata.thumb),
                        n.setAttribute("alt", hsData.data.gamedata.name),
                        n.setAttribute("width", "200"),
                        n.setAttribute("height", "200"),
                        d.appendChild(n),
                        r = document.createElement("div"),
                        d.appendChild(r),
                        o = document.createTextNode(hsData.data.gamedata.name),
                        r.appendChild(o),
                        T.getElementById("leaderboard-wrapper-header").appendChild(l));
                        var n = document.createElement("div");
                        n.id = "leaderboardRankingWrap";
                        var d = document.createElement("div");
                        d.id = "tabsButtonWraps";
                        var r = document.createElement("button");
                        r.style.width = "50%",
                        r.onclick = function() {
                            e("leader", !1)
                        }
                        ,
                        r.className = "leader" === t ? "tabs_links active" : "tabs_links";
                        var o = document.createTextNode(hsData.data.gamedata.bname);
                        r.appendChild(o);
                        var l = document.createElement("button");
                        l.style.width = "50%",
                        l.onclick = function() {
                            e("share", !1)
                        }
                        ,
                        l.className = "share" === t ? "tabs_links active" : "tabs_links";
                        o = document.createTextNode("Share");
                        if (l.appendChild(o),
                        d.appendChild(r),
                        d.appendChild(l),
                        n.appendChild(d),
                        "leader" === t || "friend" === t) {
                            R = M = 0,
                            L = -99999;
                            var c = document.createElement("div");
                            "friend" === t ? c.className = "leaderboardRankinsRrap friendWrap" : (c.id = "leaderboardScrollDiv",
                            c.className = "leaderboardRankinsRrap");
                            l = Math.max(document.documentElement.clientHeight, window.parent.innerHeight || 0),
                            d = window.parent.innerWidth;
                            l < 711 && c.setAttribute("style", "height:calc(" + l + "px - 214px);"),
                            d < 601 && c.setAttribute("style", "height:calc(" + l + "px - 214px);");
                            var s = document.createElement("div");
                            s.className = "leaderboardTopTreWrap";
                            var m, p, u, g, h = hsData.data.scoredata;
                            for ("friend" === t && (h = hsData.data.frndboard),
                            i = 0; i < h.length; i++) {
                                R++,
                                h[i].scores != L && (M = R,
                                L = h[i].scores),
                                m = "default-avatar.jpg",
                                h[i].avatar && (m = h[i].avatar);
                                var b, v, w, f = document.createElement("div"), y = (i < 3 ? (0 === i ? f.className = "leaderboardTopTre leaderboardUserTop3First" : 1 === i ? f.className = "leaderboardTopTre leaderboardUserTop3Second" : f.className = "leaderboardTopTre leaderboardUserTop3Third",
                                (b = document.createElement("div")).className = "topThreeWrap",
                                (x = document.createElement("div")).className = "leaderboardRowRank",
                                A = document.createTextNode(I(M)),
                                x.appendChild(A),
                                b.appendChild(x),
                                (g = document.createElement("a")).setAttribute("href", "https://lagged.com/profile/" + h[i].uid),
                                g.setAttribute("target", "_blank"),
                                (p = document.createElement("img")).setAttribute("src", "https://lagged.com/images/avatars/" + m),
                                p.setAttribute("width", "100"),
                                p.setAttribute("height", "100"),
                                g.appendChild(p),
                                b.appendChild(g),
                                f.appendChild(b),
                                (v = document.createElement("div")).className = "leaderRowUsernameTop",
                                (b = document.createElement("a")).setAttribute("href", "https://lagged.com/profile/" + h[i].uid),
                                b.setAttribute("target", "_blank"),
                                w = document.createTextNode(B(h[i].username)),
                                b.appendChild(w),
                                v.appendChild(b),
                                f.appendChild(v)) : (f.className = "leaderboardUserRowWrap",
                                (x = document.createElement("div")).className = "leaderboardRowRank",
                                A = document.createTextNode(I(M)),
                                x.appendChild(A),
                                f.appendChild(x),
                                (g = document.createElement("a")).setAttribute("href", "https://lagged.com/profile/" + h[i].uid),
                                g.setAttribute("target", "_blank"),
                                (p = document.createElement("img")).setAttribute("src", "https://lagged.com/images/avatars/" + m),
                                p.setAttribute("width", "100"),
                                p.setAttribute("height", "100"),
                                g.appendChild(p),
                                v = document.createElement("div"),
                                w = document.createTextNode(B(h[i].username)),
                                v.appendChild(w),
                                g.appendChild(v),
                                f.appendChild(g)),
                                (u = document.createElement("div")).className = "leaderboardRowScore",
                                document.createTextNode(k(h[i].scores)));
                                u.appendChild(y),
                                f.appendChild(u),
                                i < 3 ? (s.appendChild(f),
                                c.appendChild(s)) : c.appendChild(f)
                            }
                            "leader" === t && (c.onscroll = function() {
                                var e, o, l, c, s, t, a;
                                e = hsData.data.gamedata.id,
                                o = M,
                                l = R,
                                c = L,
                                (a = T.getElementById("leaderboardScrollDiv")).scrollTop + a.offsetHeight >= a.scrollHeight && !D && !_ && (D || ((s = document.createElement("div")).id = "newScoresLoading",
                                T.getElementById("leaderboardScrollDiv").appendChild(s),
                                S++,
                                D = !0,
                                (t = new XMLHttpRequest).onreadystatechange = function() {
                                    if (4 == this.readyState && 200 == this.status) {
                                        var e = (e = this.responseText).replace(")]}',", "");
                                        if (e = JSON.parse(e),
                                        M = o,
                                        R = l,
                                        L = c,
                                        e.success) {
                                            e.isfinished && (_ = !0);
                                            var t = e.scoredata;
                                            for (hsData.data.scoredata = hsData.data.scoredata.concat(t),
                                            i = 0; i < t.length; i++) {
                                                R++,
                                                t[i].scores != L && (M = R,
                                                L = t[i].scores);
                                                var a = "default-avatar.jpg";
                                                t[i].avatar && (a = t[i].avatar);
                                                var n = document.createElement("div");
                                                n.className = "leaderboardUserRowWrap";
                                                var d = document.createElement("div");
                                                d.className = "leaderboardRowRank";
                                                var r = document.createTextNode(I(M));
                                                d.appendChild(r),
                                                n.appendChild(d);
                                                r = document.createElement("a");
                                                r.setAttribute("href", "https://lagged.com/profile/" + t[i].uid),
                                                r.setAttribute("target", "_blank");
                                                d = document.createElement("img");
                                                d.setAttribute("src", "https://lagged.com/images/avatars/" + a),
                                                d.setAttribute("width", "100"),
                                                d.setAttribute("height", "100"),
                                                r.appendChild(d);
                                                a = document.createElement("div"),
                                                d = document.createTextNode(B(t[i].username));
                                                a.appendChild(d),
                                                r.appendChild(a),
                                                n.appendChild(r);
                                                a = document.createElement("div");
                                                a.className = "leaderboardRowScore";
                                                r = document.createTextNode(k(t[i].scores));
                                                a.appendChild(r),
                                                n.appendChild(a),
                                                T.getElementById("leaderboardScrollDiv").appendChild(n)
                                            }
                                        } else
                                            _ = !0,
                                            console.log(e.errors);
                                        D = !1,
                                        s.remove()
                                    }
                                }
                                ,
                                (a = {
                                    ftype: "loadmorehs"
                                }).countr = S,
                                a.boardid = parseInt(e, 10) || 0,
                                t.open("POST", "//lagged.com/api/v3/ajax.php", !0),
                                t.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
                                t.send("ftype=" + a.ftype + "&countr=" + S + "&boardid=" + a.boardid),
                                5 === S && (_ = !0)))
                            }
                            ),
                            n.appendChild(c),
                            "leader" === t ? (m = "default-avatar.jpg",
                            hsData.data.gamedata.avatar && (m = hsData.data.gamedata.avatar),
                            (N = document.createElement("div")).className = "leaderboardUserRowWrap leaderboardBestScoreBottom",
                            (g = document.createElement("a")).setAttribute("href", "https://lagged.com/profile/" + hsData.data.gamedata.uid),
                            g.setAttribute("target", "_blank"),
                            (p = document.createElement("img")).setAttribute("src", "https://lagged.com/images/avatars/" + m),
                            p.setAttribute("width", "100"),
                            p.setAttribute("height", "100"),
                            g.appendChild(p),
                            v = document.createElement("div"),
                            w = document.createTextNode(B(hsData.data.gamedata.username)),
                            v.appendChild(w),
                            g.appendChild(v),
                            N.appendChild(g),
                            (u = document.createElement("div")).className = "leaderboardRowScore",
                            y = document.createTextNode(k(hsData.data.utop.score)),
                            u.appendChild(y),
                            N.appendChild(u),
                            n.appendChild(N)) : "friend" === t && ((N = document.createElement("div")).className = "leaderboardUserRowWrap leaderboardBestScoreBottom friendsinvitebottom",
                            (E = document.createElement("div")).className = "invitethefriends",
                            C = document.createTextNode("Games are more fun with friends!"),
                            E.appendChild(C),
                            N.appendChild(E),
                            (g = document.createElement("a")).setAttribute("href", "https://lagged.com/invite"),
                            g.setAttribute("target", "_blank"),
                            g.className = "main_hs_btn inviteFriendsLink",
                            C = document.createTextNode("Invite your friends"),
                            g.appendChild(C),
                            N.appendChild(g),
                            n.appendChild(N))
                        } else {
                            var E = document.createElement("div");
                            E.className = "signup_txti headeronform";
                            var C = document.createTextNode("You scored " + k(hsData.data.utop.score) + "!");
                            E.appendChild(C),
                            n.appendChild(E);
                            var N = document.createElement("a")
                              , C = document.createTextNode("Share It!");
                            N.className = "shareitlink facebook",
                            N.setAttribute("href", "https://www.facebook.com/dialog/share?app_id=614526822036983&display=popup&href=https%3A%2F%2Flagged.com%2Fen%2Fg%2F" + encodeURIComponent(hsData.data.gamedata.url_key) + "&quote=I%20scored%20" + k(hsData.data.utop.score) + "%20in%20" + encodeURIComponent(hsData.data.gamedata.name) + "!&redirect_uri=https%3A%2F%2Flagged.com%2Fen%2Fg%2F" + encodeURIComponent(hsData.data.gamedata.url_key)),
                            N.setAttribute("target", "_blank"),
                            N.appendChild(C);
                            E = document.createElement("a"),
                            C = document.createTextNode("Tweet It!");
                            E.className = "shareitlink twitter",
                            E.setAttribute("href", "https://twitter.com/intent/tweet?text=I%20scored%20" + k(hsData.data.utop.score) + "%20in%20" + encodeURIComponent(hsData.data.gamedata.name) + "%20https%3A%2F%2Flagged.com%2Fen%2Fg%2F" + encodeURIComponent(hsData.data.gamedata.url_key) + "&source=webclient"),
                            E.setAttribute("target", "_blank"),
                            E.appendChild(C),
                            n.appendChild(N),
                            n.appendChild(E)
                        }
                        T.getElementById("leaderboard-wrapper").appendChild(n)
                    }("leader", !0)) : 4 == this.readyState && (C(),
                    alert("Error loading leaderboard"))
                }
                ,
                (t = {}).board = hsData.data.gamedata.id,
                t.sorder = hsData.data.gamedata.score_order,
                e.open("POST", "//lagged.com/api/v3/ajax_hs2_p2.php", !0),
                e.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
                e.send("data=" + JSON.stringify(t)))
            }
            ,
            c.className = "main_hs_btn viewranks",
            s = document.createTextNode("View Leaderboard"),
            c.appendChild(s),
            e.appendChild(n),
            e.appendChild(c)) : ((t = document.createElement("div")).id = "guestscorecircle",
            (d = document.createElement("div")).className = "yourscore_txtdiv",
            r = document.createTextNode("Your High Score"),
            d.appendChild(r),
            (o = document.createElement("div")).className = "finalscore_divtxt",
            l = document.createTextNode(k(hsData.data.topscore)),
            o.appendChild(l),
            t.appendChild(d),
            t.appendChild(o),
            e.appendChild(t),
            (c = document.createElement("button")).onclick = function() {
                !function r(e) {
                    2 === e ? T.getElementById("achlistwrap").remove() : 1 === e ? (T.getElementById("guestscorecircle").remove(),
                    T.getElementsByClassName("signup_txti")[0].remove(),
                    T.getElementsByClassName("viewleaderguest")[0].remove(),
                    T.getElementsByClassName("moregames_wrapper")[0].remove(),
                    T.getElementsByClassName("main_hs_btn")[0].remove()) : T.getElementById("signupFormWrap").remove();
                    var t = document.createElement("div");
                    t.id = "signupFormWrap";
                    var o = 2 === e ? !1 : !0;
                    isMobile = window.mobilecheck();
                    var a = document.createElement("div");
                    a.id = "tabsButtonWraps",
                    a.className = "logintabs",
                    (d = document.createElement("button")).className = "tabs_links active",
                    d.style.width = "50%";
                    var n = document.createTextNode("Sign Up for Free");
                    d.appendChild(n),
                    a.appendChild(d),
                    (d = document.createElement("button")).className = "tabs_links",
                    d.style.width = "50%",
                    d.onclick = function() {
                        !function() {
                            T.getElementById("signupFormWrap").remove();
                            var e = document.createElement("div");
                            e.id = "signupFormWrap";
                            var t = document.createElement("div");
                            t.id = "tabsButtonWraps",
                            t.className = "logintabs",
                            (d = document.createElement("button")).onclick = function() {
                                r(3)
                            }
                            ,
                            d.className = "tabs_links",
                            d.style.width = "50%";
                            var a = document.createTextNode("Sign Up for Free");
                            d.appendChild(a),
                            t.appendChild(d),
                            (d = document.createElement("button")).className = "tabs_links active",
                            d.style.width = "50%",
                            a = document.createTextNode("Log in"),
                            d.appendChild(a),
                            t.appendChild(d),
                            e.appendChild(t);
                            var n = document.createElement("form");
                            n.id = "loginit",
                            n.onsubmit = function() {
                                return E("login")
                            }
                            ,
                            (a = document.createElement("div")).className = "form-group";
                            var d = document.createElement("label");
                            d.setAttribute("form", "inputEmail2"),
                            t = document.createTextNode("Your email address"),
                            d.appendChild(t),
                            a.appendChild(d),
                            (t = document.createElement("input")).setAttribute("type", "email"),
                            t.setAttribute("name", "name"),
                            t.id = "inputEmail2",
                            t.className = "form-control",
                            t.required = !0,
                            isMobile || (t.autofocus = !0),
                            a.appendChild(t),
                            n.appendChild(a),
                            (d = document.createElement("div")).className = "form-group",
                            (t = document.createElement("label")).setAttribute("form", "inputEmail3"),
                            a = document.createTextNode("Your password"),
                            t.appendChild(a),
                            d.appendChild(t),
                            (t = document.createElement("input")).setAttribute("type", "password"),
                            t.setAttribute("name", "name"),
                            t.id = "inputEmail3",
                            t.className = "form-control",
                            t.required = !0,
                            d.appendChild(t),
                            n.appendChild(d),
                            (t = document.createElement("button")).onclick = function() {
                                return E("login", o)
                            }
                            ,
                            t.className = "main_hs_btn viewranks",
                            t.id = "createloginBtnMain",
                            d = document.createTextNode("Submit"),
                            t.appendChild(d),
                            n.appendChild(t),
                            e.appendChild(n),
                            t = document.createElement("a"),
                            n = document.createTextNode("Forgot password?"),
                            t.style.marginTop = "15px",
                            t.setAttribute("href", "https://lagged.com/help/password/"),
                            t.setAttribute("target", "_blank"),
                            t.appendChild(n),
                            e.appendChild(t),
                            T.getElementById("leaderboard-wrapper").appendChild(e),
                            isMobile || T.getElementById("inputEmail2").focus()
                        }()
                    }
                    ,
                    n = document.createTextNode("Log in"),
                    d.appendChild(n),
                    a.appendChild(d),
                    t.appendChild(a);
                    e = document.createElement("form");
                    e.id = "loginit",
                    e.onsubmit = function() {
                        return E("signup")
                    }
                    ;
                    n = document.createElement("div");
                    n.className = "form-group";
                    var d = document.createElement("label");
                    d.setAttribute("form", "inputEmail1");
                    a = document.createTextNode("Choose a nickname");
                    d.appendChild(a),
                    n.appendChild(d);
                    a = document.createElement("input");
                    a.setAttribute("type", "text"),
                    a.setAttribute("name", "name"),
                    a.id = "inputEmail1",
                    a.className = "form-control",
                    a.required = !0,
                    isMobile || (a.autofocus = !0),
                    n.appendChild(a),
                    e.appendChild(n);
                    d = document.createElement("div");
                    d.className = "form-group";
                    a = document.createElement("label");
                    a.setAttribute("form", "inputEmail2");
                    n = document.createTextNode("Your email address");
                    a.appendChild(n),
                    d.appendChild(a);
                    n = document.createElement("input");
                    n.setAttribute("type", "email"),
                    n.setAttribute("name", "name"),
                    n.id = "inputEmail2",
                    n.className = "form-control",
                    n.required = !0,
                    d.appendChild(n),
                    e.appendChild(d);
                    a = document.createElement("div");
                    a.className = "form-group";
                    n = document.createElement("label");
                    n.setAttribute("form", "inputEmail3");
                    d = document.createTextNode("Create a password");
                    n.appendChild(d),
                    a.appendChild(n);
                    n = document.createElement("input");
                    n.setAttribute("type", "password"),
                    n.setAttribute("name", "name"),
                    n.setAttribute("placeholder", "At least 6 characters"),
                    n.id = "inputEmail3",
                    n.className = "form-control",
                    n.required = !0,
                    a.appendChild(n),
                    e.appendChild(a);
                    n = document.createElement("button");
                    n.onclick = function() {
                        return E("signup", o)
                    }
                    ,
                    n.className = "main_hs_btn viewranks",
                    n.id = "createloginBtnMain";
                    a = document.createTextNode("Submit");
                    n.appendChild(a),
                    e.appendChild(n),
                    t.appendChild(e),
                    T.getElementById("leaderboard-wrapper").appendChild(t),
                    isMobile || T.getElementById("inputEmail1").focus()
                }(1)
            }
            ,
            c.className = "main_hs_btn guestsubmitmainhs",
            s = document.createTextNode("Submit High Score"),
            c.appendChild(s),
            e.appendChild(c),
            (g = document.createElement("a")).onclick = function() {
                try {
                    window.parent.openLeaderboards()
                } catch (e) {
                    console.log(e)
                }
            }
            ,
            g.className = "viewleaderguest",
            (p = document.createElement("img")).setAttribute("src", "https://imgs2.dab3games.com/highscore-games-icon.jpg"),
            p.setAttribute("alt", "icon"),
            p.setAttribute("width", "40"),
            p.setAttribute("height", "40"),
            g.appendChild(p),
            u = document.createTextNode("View Leaderboard"),
            g.appendChild(u),
            e.appendChild(g));
            var p = document.createElement("div");
            hsData.data.login ? p.className = "popmoregameswrap" : p.className = "popmoregameswrap userrbpop";
            var u = document.createElement("div");
            u.className = "signup_txti moregametxt guessmoregmtxt",
            hsData.data.login || (u.className = "signup_txti moregametxt");
            var g = document.createTextNode("More Games");
            u.appendChild(g),
            p.appendChild(u);
            var h = window.parent.jsMoreGames
              , b = document.createElement("div");
            b.className = "moregames_wrapper guestmoregames";
            var v = 12;
            for (hsData.data.login || (v = 5,
            b.className = "moregames_wrapper"),
            i = 0; i < v; i++) {
                var w = document.createElement("div");
                w.className = "thumbWrapper";
                var f = document.createElement("div")
                  , x = document.createElement("a");
                1 == h[i].io ? x.setAttribute("href", "https://lagged.com/io/" + h[i].url_key) : x.setAttribute("href", "https://lagged.com/en/g/" + h[i].url_key),
                x.setAttribute("title", h[i].name),
                x.setAttribute("target", "_blank");
                var A = document.createTextNode(h[i].name);
                x.appendChild(A);
                var y = document.createElement("img");
                y.setAttribute("src", "https://imgs2.dab3games.com/" + h[i].thumb),
                y.setAttribute("alt", h[i].name),
                y.setAttribute("width", "200"),
                y.setAttribute("height", "200"),
                f.appendChild(x),
                f.appendChild(y),
                w.appendChild(f),
                b.appendChild(w)
            }
            p.appendChild(b),
            e.appendChild(p),
            T.body.appendChild(e),
            C()
        }()) : (C(),
        T.getElementById("leaderboard-modal").remove(),
        alert("Error: Could not save high score!"),
        console.log(e),
        a.success = !1,
        a.errormsg = "Error: Could not save high score!"),
        t && t(a)
    }
      , n = function(e) {}
      , h = 0
      , r = function(e, t) {
        p = window.parent.isFullscreen,
        T = p ? document : window.parent.document,
        4 < ++h && (h = 1);
        var a = "achievement_pops_" + h
          , n = T.createElement("div");
        n.id = "achievementPopWrap",
        n.className = a,
        n.onclick = function() {
            T.getElementsByClassName(a)[0].remove()
        }
        ;
        var d = "Achievment Saved";
        1 < e.acount && (d = e.acount + " Achievments Saved");
        var r = document.createElement("div");
        r.className = "achievement_title";
        d = document.createTextNode(d);
        r.appendChild(d),
        n.appendChild(r);
        d = document.createElement("div");
        d.className = "achievement_desc";
        r = document.createTextNode(e.name);
        d.appendChild(r),
        n.appendChild(d);
        r = document.createElement("div");
        r.className = "achievement_xp";
        d = document.createTextNode("+" + e.points + "xp");
        if (r.appendChild(d),
        n.appendChild(r),
        T.body.appendChild(n),
        t)
            try {
                window.parent.newLevel(t)
            } catch (e) {
                console.log(e)
            }
        setTimeout(function() {
            T.getElementsByClassName(a)[0] && (s(T.getElementsByClassName(a)[0]),
            h--,
            setTimeout(function() {
                T.getElementsByClassName(a)[0] && T.getElementsByClassName(a)[0].remove()
            }, 200))
        }, 4e3)
    }
      , v = 30;
    setInterval(function() {
        v++
    }, 999);
    try {
        // var e = document.createElement("script")
        //   , t = document.getElementsByTagName("script")[0];
        // e.async = !0,
        // e.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
        // e.type = "text/javascript",
        // e.setAttribute("data-ad-client", "ca-pub-6893876361346206"),
        // e.setAttribute("data-ad-frequency-hint", "30s"),
        // e.setAttribute("data-ad-channel", "3947082707"),
        // t.parentNode.insertBefore(e, t),
        // window.adsbygoogle = window.adsbygoogle || [],
        // adBreak = adConfig = function(e) {
        //     adsbygoogle.push(e)
        // }
        // ,
        // setTimeout(function() {
        //     try {
        //         adConfig({
        //             preloadAdBreaks: "on"
        //         })
        //     } catch (e) {
        //         console.log(e)
        //     }
        // }, 2e3)
    } catch (e) {
        console.log(e)
    }
    var w, f = !(LaggedAPI.GEvents = {
        start: function() {
            adBreak({
                type: "start",
                name: "start-game",
                beforeAd: ()=>{
                    W(!0)
                }
                ,
                afterAd: ()=>{
                    q(!0)
                }
            })
        },
        next: function() {
            adBreak({
                type: "next",
                name: "next-level",
                beforeAd: ()=>{
                    W(!0)
                }
                ,
                afterAd: ()=>{
                    q(!0)
                }
            })
        },
        reward: function(t, e) {
            console.log("offer reward? nothing will happen if cant"),
            adBreak({
                type: "reward",
                name: "reward",
                beforeAd: ()=>{
                    W(!1)
                }
                ,
                afterAd: ()=>{
                    q(!1)
                }
                ,
                beforeReward: e=>{
                    x(e, t)
                }
                ,
                adDismissed: ()=>{
                    A(e)
                }
                ,
                adComplete: ()=>{
                    F(e)
                }
            }),
            w = setTimeout(function() {
                f || (e(!1),
                t(!1))
            }, 1e3)
        }
    }), y = !1, x = function(e, t) {
        console.log("can give reward"),
        clearTimeout(w),
        t(f = !0, e)
    }, A = function(e) {
        console.log("ad dismissed"),
        e(f = !1)
    }, F = function(e) {
        e(!(f = !1));
        try {
            window.parent.gtag("event", "conversion", {
                send_to: "AW-1055364430/XhxXCIeIx_wBEM6qnvcD"
            })
        } catch (e) {
            console.log(e)
        }
    }, W = function(e) {
        if (v = 0,
        u)
            try {
                window.parent.postMessage("apiHide", "*")
            } catch (e) {
                console.log(e)
            }
        else {
            try {
                window.parent.document.getElementById("mobile-right") && (window.parent.document.getElementById("mobile-right").style.display = "none"),
                window.parent.document.getElementById("minividbtn") && (window.parent.document.getElementById("minividbtn").style.display = "none"),
                window.parent.document.getElementById("gameplug") && (window.parent.document.getElementById("gameplug").style.display = "none"),
                window.parent.document.getElementById("exitfullscreen") && (window.parent.document.getElementById("exitfullscreen").style.display = "none")
            } catch (e) {
                console.log(e)
            }
            try {
                window.parent.window.parent.document.getElementById("adsContainer") && window.parent.window.parent.document.getElementById("adsContainer").remove()
            } catch (e) {
                console.log(e)
            }
        }
        if (y = !0,
        e)
            try {
                window.parent.gtag("event", "conversion", {
                    send_to: "AW-1055364430/XhxXCIeIx_wBEM6qnvcD"
                })
            } catch (e) {
                console.log(e)
            }
    }, q = function(e) {
        if (u)
            try {
                window.parent.postMessage("apiShow", "*")
            } catch (e) {
                console.log(e)
            }
        else
            try {
                window.parent.document.getElementById("mobile-right") && (window.parent.document.getElementById("mobile-right").style.display = "block"),
                window.parent.document.getElementById("minividbtn") && (window.parent.document.getElementById("minividbtn").style.display = "block"),
                window.parent.document.getElementById("gameplug") && (window.parent.document.getElementById("gameplug").style.display = "block"),
                window.parent.document.getElementById("exitfullscreen") && (window.parent.document.getElementById("exitfullscreen").style.display = "block")
            } catch (e) {
                console.log(e)
            }
        v = e ? 5 : 30,
        y = !1
    };
    LaggedAPI.APIAds = {
        show: function(e, t, a, n) {
         }
    },
    window.mobilecheck = function() {
        var e = !1
          , t = navigator.userAgent || navigator.vendor || window.opera;
        return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0),
        e
    }
    ,
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this)
    }
    ,
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
        for (var e = this.length - 1; 0 <= e; e--)
            this[e] && this[e].parentElement && this[e].parentElement.removeChild(this[e])
    }
}();
