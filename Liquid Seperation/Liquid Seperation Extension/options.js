!(function s(r, a, c) {
    function u(t, e) {
        if (!a[t]) {
            if (!r[t]) {
                var o = "function" == typeof require && require;
                if (!e && o) return o(t, !0);
                if (l) return l(t, !0);
                var i = new Error("Cannot find module '" + t + "'");
                // @ts-ignore
                throw ((i.code = "MODULE_NOT_FOUND"), i);
            }
            var n = (a[t] = { exports: {} });
            r[t][0].call(
                n.exports,
                function (e) {
                    return u(r[t][1][e] || e);
                },
                n,
                n.exports,
                s,
                r,
                a,
                c
            );
        }
        return a[t].exports;
    }
    for (var l = "function" == typeof require && require, e = 0; e < c.length; e++) u(c[e]);
    return u;
})(
    {
        1: [
            function (e, t, o) {
                "use strict";
                Object.defineProperty(o, "__esModule", { value: !0 }),
                    (o.loadOptions = function (o) {
                        chrome.storage.local.get({ region: "", displayMode: 2, topSites: !0, siteSearch: !0 }, function (e) {
                            var t = new n(e.region, e.displayMode, e.topSites, e.siteSearch);
                            o(t);
                        });
                    }),
                    (o.resetOptions = function (e) {
                        chrome.storage.local.remove(["region", "displayMode", "topSites", "siteSearch", "defaultSearch"], e);
                    });
                var a = function () {};
                o.MostVisitedURL = a;
                var i = function (e, t, o) {
                    void 0 === o && (o = !1), (this.name = e), (this.url = t), (this.isDefault = o);
                };
                o.CustomSearch = i;
                var n =
                    ((s.prototype.save = function (e) {
                        chrome.storage.local.set({ region: this.region, displayMode: this.displayMode, topSites: this.topSites, siteSearch: this.siteSearch }, e);
                    }),
                        (s.prototype.changeSearch = function (e, t) {
                            chrome.storage.local.set({ defaultSearch: e }, t);
                        }),
                        (s.prototype.listTopSites = function (r) {
                            chrome.topSites.get(function (e) {
                                for (var t = [], o = 0, i = e.slice(0, 7); o < i.length; o++) {
                                    var n = i[o],
                                        s = new a();
                                    (s.title = n.title), (s.url = n.url), (s.image = "chrome://favicon/size/64/" + n.url), t.push(s);
                                }
                                r(t);
                            });
                        }),
                        (s.prototype.listCustomSearch = function (s) {
                            var r = [
                                new i("bing", "https://www.bing.com/search?q={0}"),
                                new i("brave", "https://search.brave.com/search?q={0}&source=web")
                            ];
                            chrome.storage.local.get({ defaultSearch: "" }, function (e) {
                                var t = !1;
                                if ("" !== e.defaultSearch)
                                    for (var o = 0, i = r; o < i.length; o++) {
                                        var n = i[o];
                                        n.name === e.defaultSearch ? (t = n.isDefault = !0) : (n.isDefault = !1);
                                    }
                                !t && 1 <= r.length && (r[0].isDefault = !0), s(r);
                            });
                        }),
                        s);
                function s(e, t, o, i) {
                    void 0 === e && (e = ""), void 0 === t && (t = 2), void 0 === o && (o = !0), void 0 === i && (i = !0), (this.region = e), (this.displayMode = t), (this.topSites = o), (this.siteSearch = i);
                }
                o.Options = n;
            },
            {},
        ],
        2: [
            function (e, t, o) {
                "use strict";
                Object.defineProperty(o, "__esModule", { value: !0 });
                var i = e("./app"),
                    n = document.getElementById("sourceRegion"),
                    s = document.getElementById("displayMode"),
                    r = document.getElementById("saveStatus"),
                    a = document.getElementById("resetOptions"),
                    c = document.getElementById("saveOptions");
                (a.onclick = function (e) {
                    e.preventDefault(),
                        i.resetOptions(function () {
                            // @ts-ignore
                            (n.value = ""), (s.value = "2"), chrome.runtime.sendMessage("options_changed");
                        });
                }),
                    (c.onclick = function (e) {
                        e.preventDefault(),
                            i.loadOptions(function (e) {
                                // @ts-ignore
                                (e.region = n.value),
                                    // @ts-ignore
                                    (e.displayMode = Number(s.value)),
                                    e.save(function () {
                                        (r.innerHTML = "Options saved."),
                                            r.classList.remove("hide"),
                                            r.classList.add("show"),
                                            chrome.runtime.sendMessage("options_changed"),
                                            setTimeout(function () {
                                                r.classList.remove("show"), r.classList.add("hide");
                                            }, 2500);
                                    });
                            });
                    }),
                    i.loadOptions(function (e) {
                        // @ts-ignore
                        (n.value = e.region), (s.value = String(e.displayMode));
                    });
            },
            { "./app": 1 },
        ],
    },
    {},
    [2]
);
