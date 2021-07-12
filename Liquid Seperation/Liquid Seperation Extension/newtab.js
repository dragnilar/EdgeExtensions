let quickLinkCount = 0;
!(function r(s, a, c) {
    function l(t, e) {
        if (!a[t]) {
            if (!s[t]) {
                var o = "function" == typeof require && require;
                if (!e && o) return o(t, !0);
                if (u) return u(t, !0);
                var n = new Error("Cannot find module '" + t + "'");
                throw ((n.code = "MODULE_NOT_FOUND"), n);
            }
            var i = (a[t] = { exports: {} });
            s[t][0].call(
                i.exports,
                function (e) {
                    return l(s[t][1][e] || e);
                },
                i,
                i.exports,
                r,
                s,
                a,
                c
            );
        }
        return a[t].exports;
    }
    for (var u = "function" == typeof require && require, e = 0; e < c.length; e++) l(c[e]);
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
                var a = function () {};
                o.MostVisitedURL = a;
                var n = function (e, t, o) {
                    void 0 === o && (o = !1), (this.name = e), (this.url = t), (this.isDefault = o);
                };
                o.CustomSearch = n;
                var i =
                    ((r.prototype.save = function (e) {
                        chrome.storage.local.set({ region: this.region, displayMode: this.displayMode, topSites: this.topSites, siteSearch: this.siteSearch }, e);
                    }),
                    (r.prototype.changeSearch = function (e, t) {
                        chrome.storage.local.set({ defaultSearch: e }, t);
                    }),
                    (r.prototype.listTopSites = function (s) 
                    {   
                        //Add Bookmark folder
                        chrome.bookmarks.create(
                        {	
                            'title': 'Edge Quick Links'
                        },
                        );	
                        //Get quick links from the book mark "Edge Quick LInks"
                        chrome.bookmarks.search('Edge Quick Links', function(node)
                        {
                            var tempTopSiteList = [];
                            var edgeQuickLinks = chrome.bookmarks.getChildren(node[0].id, function(edgeQuickLinks)
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
                    (r.prototype.listCustomSearch = function (r) {
                        var s = [
                            new n("google", "https://www.google.com/search?q={0}", !0),
                            new n("bing", "https://www.bing.com/search?q={0}"),
                            new n("baidu", "https://www.baidu.com/s?wd={0}"),
                            new n("duckduckgo", "https://duckduckgo.com/?q={0}&ia=web"),
                        ];
                        chrome.storage.local.get({ defaultSearch: "" }, function (e) {
                            var t = !1;
                            if ("" != e.defaultSearch)
                                for (var o = 0, n = s; o < n.length; o++) {
                                    var i = n[o];
                                    i.name == e.defaultSearch ? (t = i.isDefault = !0) : (i.isDefault = !1);
                                }
                            !t && 1 <= s.length && (s[0].isDefault = !0), r(s);
                        });
                    }),
                    r);
                function r(e, t, o, n) {
                    void 0 === e && (e = ""), void 0 === t && (t = 2), void 0 === o && (o = !0), void 0 === n && (n = !0), (this.region = e), (this.displayMode = t), (this.topSites = o), (this.siteSearch = n);
                }
                o.Options = i;
            },
            {},
        ],
        2: [
            function (e, t, o) {
                "use strict";
                Object.defineProperty(o, "__esModule", { value: !0 });
                var i = e("../typings/commonlib"),
                    n = e("./app"),
                    s = document.querySelector(".searchbox__dropdown"),
                    a = document.querySelector(".searchbox__dropdown-menu"),
                    r = document.getElementById("search-action"),
                    c = document.getElementById("form1"),
                    l = document.getElementById("bg"),
                    u = document.getElementById("photoTitle"),
                    d = document.getElementById("photoLink"),
                    f = document.getElementById("setting"),
                    p = document.querySelector(".settings__dialog"),
                    h = document.getElementById("siteSearchOption"),
                    m = document.getElementById("topSitesOption"),
                    g = document.querySelector(".settings__dialog-close");
                function v() {
                    var e = c.value.trim();
                    if ("" != e) {
                        var t = s.getAttribute("data-value"),
                            o = a.querySelector("[data-value='" + t + "']");
                        if (null != o) {
                            var n = i.formatString(o.getAttribute("data-url"), encodeURIComponent(e));
                            chrome.tabs.update({ url: n });
                        }
                    }
                }
                function y() {
                    s.classList.remove("show"), a.classList.remove("show");
                }
                f.addEventListener("click", function (e) {
                    var t = e.currentTarget;
                    if (p.classList.contains("show")) p.classList.remove("show");
                    else {
                        var o = t.getBoundingClientRect();
                        i.setStyles(p, { position: "absolute", "will-change": "transform", top: "0px", left: "0px", transform: "translate3d(" + (o.left - 260) + "px, " + o.height + "px, 0px)" }), p.classList.add("show");
                    }
                }),
                    r.addEventListener("click", function (e) {
                        e.preventDefault(), v();
                    }),
                    c.addEventListener("keydown", function (e) {
                        13 === e.keyCode && (e.preventDefault(), v());
                    }),
                    s.addEventListener("click", function (e) {
                        var t = e.currentTarget;
                        if (t.classList.contains("show")) return t.classList.remove("show"), void a.classList.remove("show");
                        t.classList.add("show");
                        var o = t.getBoundingClientRect();
                        i.setStyles(a, { position: "absolute", "will-change": "transform", top: "0px", left: "0px", transform: "translate3d(0px, " + o.height + "px, 0px)" }), a.classList.add("show");
                    }),
                    a.addEventListener("mouseleave", function (e) {
                        y();
                    }),
                    h.addEventListener("click", function (e) {
                        n.loadOptions(function (e) {
                            (document.querySelector(".searchbox-container").style.display = h.checked ? "block" : "none"), (e.siteSearch = h.checked), e.save();
                        });
                    }),
                    g.addEventListener("click", function (e) {
                        p.classList.remove("show");
                    }),
                    m.addEventListener("click", function (e) {
                        n.loadOptions(function (e) {
                            (document.querySelector(".topsites").style.display = m.checked ? "block" : "none"), (e.topSites = m.checked), e.save();
                        });
                    }),
                    n.loadOptions(function (e) {
                        e.siteSearch ? (h.checked = !0) : (document.querySelector(".searchbox-container").style.display = "none"),
                            e.topSites ? (m.checked = !0) : (document.querySelector(".topsites").style.display = "none"),
                            (function (r) {
                                r.listCustomSearch(function (e) {
                                    for (var t = 0, o = e; t < o.length; t++) {
                                        var n = o[t],
                                            i = '<a class="searchbox__dropdown-item" href="#" data-url=' + n.url + ' data-value="' + n.name + '">' + n.name + "</a>";
                                        a.insertAdjacentHTML("beforeend", i), n.isDefault && (s.setAttribute("data-value", n.name), (document.querySelector("#customSearchName").innerText = n.name));
                                    }
                                    a.querySelectorAll("a").forEach(function (e, t) {
                                        e.addEventListener("click", function (e) {
                                            e.preventDefault();
                                            var t = e.target.getAttribute("data-value");
                                            y(), (document.querySelector("#customSearchName").innerText = t), s.setAttribute("data-value", t), r.changeSearch(t);
                                        });
                                    });
                                });
                            })(e),
                            (function (e) {
                                e.listTopSites(function (e) {
                                    for (o = 0, n = e; o < n.length; o++) 
                                    {
                                        var i = n[o],
                                            r =
                                                ' <div class="topsites__site">\n            <a class="topsites__link" href="' +
                                                i.url +
                                                '">\n                <div class="topsites__content">\n                    <img class="topsites__img" src="' +
                                                i.image +
                                                '" />\n                    <span class="topsites__title">' +
                                                i.title +
                                                "</span>\n                </div>\n            </a>";

                                        quickLinkCount++;
                                        if(quickLinkCount <= 8)
                                        {
                                            var t = document.getElementById("topsites-grid-1");
                                            t.insertAdjacentHTML("beforeend", r);
                                        }
                                        else if(quickLinkCount >= 9 && quickLinkCount < 17)
                                        {
                                            var t = document.getElementById("topsites-grid-2");
                                            t.insertAdjacentHTML("beforeend", r);
                                        }
                                        else if(quickLinkCount >= 17 && quickLinkCount < 25)
                                        {
                                            var t = document.getElementById("topsites-grid-3");
                                            t.insertAdjacentHTML("beforeend", r);
                                        }
                                        else if (quickLinkCount >= 25)
                                        {
                                            var t = document.getElementById("topsites-grid-4");
                                            t.insertAdjacentHTML("beforeend", r);
                                        }
                                    }
                                });
                            })(e);
                    }),
                    chrome.runtime.sendMessage("get_image", function (e) {
                        null != e && (l.setAttribute("style", "background-image:url('" + encodeURI(e.fullImage) + "');"), (u.innerText = e.title), d.setAttribute("href", e.fullImage), (document.body.style.display = "block"));
                    });
            },
            { "../typings/commonlib": 3, "./app": 1 },
        ],
        3: [
            function (e, t, o) {
                "use strict";
                Object.defineProperty(o, "__esModule", { value: !0 }),
                    (o.formatString = function (e) {
                        for (var t = [], o = 1; o < arguments.length; o++) t[o - 1] = arguments[o];
                        console.log(t);
                        for (var n = 0; n < t.length; n++) e = e.replace("{" + n + "}", t[n]);
                        return e;
                    }),
                    (o.setAttributes = function (e, t) {
                        for (var o in t) e.setAttribute(o, t[o]);
                    }),
                    (o.setStyles = function (e, t) {
                        for (var o in t) e.style.setProperty(o, t[o]);
                    });
            },
            {},
        ],
    },
    {},
    [2]
);
