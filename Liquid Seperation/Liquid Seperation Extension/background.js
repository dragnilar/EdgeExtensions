!(function background(a, s, u) {
    function l(t, e) {
        if (!s[t]) {
            if (!a[t]) {
                var o = "function" == typeof require && require;
                if (!e && o) return o(t, !0);
                if (c) return c(t, !0);
                var error = new Error("Cannot find module '" + t + "'");
                throw ((error.code = "MODULE_NOT_FOUND"), error);
            }
            var i = (s[t] = { exports: {} });
            a[t][0].call(
                i.exports,
                function (e) {
                    return l(a[t][1][e] || e);
                },
                i,
                i.exports,
                background,
                a,
                s,
                u
            );
        }
        return s[t].exports;
    }
    for (var c = "function" == typeof require && require, e = 0; e < u.length; e++) l(u[e]);
    return l;
})(
    {
        1: [
            function (e, t, o) {
                "use strict";
                Object.defineProperty(o, "__esModule", { value: !0 }),
                    (o.loadOptions = function (o) {
                        chrome.storage.local.get({ region: "", displayMode: 2, topSites: !0, siteSearch: !0 }, function (e) {
                            var t = new i(e.region, e.displayMode, e.topSites, e.siteSearch);
                            o(t);
                        });
                    }),
                    (o.resetOptions = function (e) {
                        chrome.storage.local.remove(["region", "displayMode", "topSites", "siteSearch", "defaultSearch"], e);
                    });
                var s = function () {};
                o.MostVisitedURL = s;
                var r = function (e, t, o) {
                    void 0 === o && (o = !1), (this.name = e), (this.url = t), (this.isDefault = o);
                };
                o.CustomSearch = r;
                var i =
                    ((n.prototype.save = function (e) {
                        chrome.storage.local.set({ region: this.region, displayMode: this.displayMode, topSites: this.topSites, siteSearch: this.siteSearch }, e);
                    }),
                    (n.prototype.changeSearch = function (e, t) {
                        chrome.storage.local.set({ defaultSearch: e }, t);
                    }),
                    (n.prototype.listTopSites = function (a) {
                        //Get quick links from the book mark "Edge Quick LInks"
                        chrome.bookmarks.search('Edge Quick Links', function(node)
                        {
                            var tempTopSiteList = [];
                            chrome.bookmarks.getChildren(node[0].id, function(edgeQuickLinks)
                            {
                                for (let index = 0; index < edgeQuickLinks.length; index++) 
                                {
                                    const currentBookMark = edgeQuickLinks[index],
                                        siteForTempList = new a();
                                    (siteForTempList.title = currentBookMark.title), 
                                    (siteForTempList.url = currentBookMark.url), 
                                    (siteForTempList.image = "chrome://favicon/size/64/" + currentBookMark.url), 
                                    tempTopSiteList.push(siteForTempList);
                                }
                                s(tempTopSiteList);
                            });
                        });	
                    }),
                    (n.prototype.listCustomSearch = function (n) {
                        var a = [
                            new r("bing", "https://www.bing.com/search?q={0}"),
                            new r("brave", "https://search.brave.com/search?q={0}&source=web"),
                        ];
                        chrome.storage.local.get({ defaultSearch: "" }, function (e) {
                            var t = !1;
                            if ("" != e.defaultSearch)
                                for (var o = 0, r = a; o < r.length; o++) {
                                    var i = r[o];
                                    i.name == e.defaultSearch ? (t = i.isDefault = !0) : (i.isDefault = !1);
                                }
                            !t && 1 <= a.length && (a[0].isDefault = !0), n(a);
                        });
                    }),
                    n);
                function n(e, t, o, r) {
                    void 0 === e && (e = ""), void 0 === t && (t = 2), void 0 === o && (o = !0), void 0 === r && (r = !0), (this.region = e), (this.displayMode = t), (this.topSites = o), (this.siteSearch = r);
                }
                o.Options = i;
            },
            {},
        ],
        2: [
            function (e, t, o) {
                "use strict";
                Object.defineProperty(o, "__esModule", { value: !0 });
                var a = e("./app"),
                    i = "https://peapix.com/bing/feed",
                    s = new a.Options(),
                    u = {};
                function l(e, t) {
                    var o = "" == e ? i : i + "?country=" + e,
                        r = new XMLHttpRequest();
                    (r.onerror = function () {
                        console.log("request " + o + " got " + r.status + " error."), t(null);
                    }),
                        (r.onreadystatechange = function () {
                            if (r.readyState == XMLHttpRequest.DONE && 200 == r.status) {
                                var e = JSON.parse(r.responseText).map(function (e) {
                                    return { pageURL: e.pageUrl, thumbURL: e.thumbUrl, title: e.title, copyright: e.copyright, date: e.date, fullImage: e.fullUrl };
                                });
                                t(e);
                            }
                        }),
                        r.open("GET", o, !0),
                        r.send(null);
                }
                function c(e, t) {
                    t({ title: e.title, copyright: e.copyright, pageURL: e.pageURL, fullImage: e.fullImage, thumbURL: e.thumbURL });
                }
                chrome.runtime.onMessage.addListener(function (e, t, o) {
                    if (
                        ("options_changed" == e &&
                            a.loadOptions(function (e) {
                                return (s = e);
                            }),
                        "get_image" == e)
                    ) {
                        var r = s.region,
                            i = u[r];
                        if (i) {
                            var n = i[0];
                            if (1 < i.length && 2 == s.displayMode) n = i[Math.floor(Math.random() * i.length)];
                            c(n, o);
                        } else
                            l(r, function (e) {
                                if (null != e) {
                                    var t = (u[r] = e)[0];
                                    if (1 < e.length && 2 == s.displayMode) t = e[Math.floor(Math.random() * e.length)];
                                    c(t, o);
                                } else o(null);
                            });
                    }
                    return !0;
                }),
                    chrome.alarms.onAlarm.addListener(function (e) {
                        var t = s.region;
                        l(t, function (e) {
                            null != e && (u[t] = e);
                        });
                    }),
                    a.loadOptions(function (e) {
                        s = e;
                    }),
                    chrome.alarms.create("UpdateImages", { periodInMinutes: 30 });
            },
            { "./app": 1 },
        ],
    },
    {},
    [2]
);
