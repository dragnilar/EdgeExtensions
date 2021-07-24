let quickLinkCount = 0;
!(function newTabModule(s, a, c) {
    function l(libraryTypes, e) {
        if (!a[libraryTypes]) {
            if (!s[libraryTypes]) {
                var isRequired = "function" == typeof require && require;
                if (!e && isRequired) return isRequired(libraryTypes, !0);
                if (u) return u(libraryTypes, !0);
                var n = new Error("Cannot find module '" + libraryTypes + "'");
                // @ts-ignore
                throw ((n.code = "MODULE_NOT_FOUND"), n);
            }
            var i = (a[libraryTypes] = { exports: {} });
            s[libraryTypes][0].call(
                i.exports,
                function (e) {
                    return l(s[libraryTypes][1][e] || e);
                },
                i,
                i.exports,
                newTabModule,
                s,
                a,
                c
            );
        }
        return a[libraryTypes].exports;
    }
    for (var u = "function" == typeof require && require, e = 0; e < c.length; e++) l(c[e]);
    return l;
})(
    {
        1: [
            function (e, t, module) {
                "use strict";
                Object.defineProperty(module, "__esModule", { value: !0 }),
                    (module.loadOptions = function (o) {
                        chrome.storage.local.get({ region: "", displayMode: 2, topSites: !0, siteSearch: !0 }, function (e) {
                            var t = new moduleOptions(e.region, e.displayMode, e.topSites, e.siteSearch);
                            o(t);
                        });
                    }),
                    (module.resetOptions = function (e) {
                        chrome.storage.local.remove(["region", "displayMode", "topSites", "siteSearch", "defaultSearch"], e);
                    });
                var a = function () {};
                module.MostVisitedURL = a;
                var n = function (e, t, o) {
                    void 0 === o && (o = !1), (this.name = e), (this.url = t), (this.isDefault = o);
                };
                module.CustomSearch = n;
                var moduleOptions =
                    ((iDunnoLoL.prototype.save = function (e) {
                        chrome.storage.local.set({ region: this.region, displayMode: this.displayMode, topSites: this.topSites, siteSearch: this.siteSearch }, e);
                    }),
                    (iDunnoLoL.prototype.changeSearch = function (e, t) {
                        chrome.storage.local.set({ defaultSearch: e }, t);
                    }),
                    (iDunnoLoL.prototype.listTopSites = function (s)
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
                    (iDunnoLoL.prototype.listCustomSearch = function (r) {
                        var s = [
                            new n("", "https://www..com/search?q={0}", !0),
                            new n("bing", "https://www.bing.com/search?q={0}"),
                            new n("brave", "https://search.brave.com/search?q={0}&source=web"),
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
                    iDunnoLoL);
                function iDunnoLoL(e, t, o, n) {
                    void 0 === e && (e = ""), void 0 === t && (t = 2), void 0 === o && (o = !0), void 0 === n && (n = !0), (this.region = e), (this.displayMode = t), (this.topSites = o), (this.siteSearch = n);
                }
                module.Options = moduleOptions;
            },
            {},
        ],
        2: [
            function (commonLibraryTypings, t, o) {
                "use strict";
                Object.defineProperty(o, "__esModule", { value: !0 });
                let i = commonLibraryTypings("../typings/commonlib"),
                    application = commonLibraryTypings("./app"),
                    searchBoxDropDownElement = document.querySelector(".searchbox__dropdown"),
                    searchBoxDropDownMenuElement = document.querySelector(".searchbox__dropdown-menu"),
                    searchActionElement = document.getElementById("search-action"),
                    form1Element = document.getElementById("form1"),
                    bgElement = document.getElementById("bg"),
                    photoTitleElement = document.getElementById("photoTitle"),
                    photoLinkElement = document.getElementById("photoLink"),
                    searchOptionElement = document.getElementById("siteSearchOption"),
                    topSiteOptionElement = document.getElementById("topSitesOption"),
                    goToOptionsButtonElement = document.getElementById("GoToOptionsButton");

                function v() {
                    // @ts-ignore
                    let e = form1Element.value.trim();
                    if ("" != e) {
                        var t = searchBoxDropDownElement.getAttribute("data-value"),
                            o = searchBoxDropDownMenuElement.querySelector("[data-value='" + t + "']");
                        if (null != o) {
                            var n = i.formatString(o.getAttribute("data-url"), encodeURIComponent(e));
                            chrome.tabs.update({ url: n });
                        }
                    }
                }
                function removeShow() {
                    searchBoxDropDownElement.classList.remove("show"), searchBoxDropDownMenuElement.classList.remove("show");
                }
                    goToOptionsButtonElement.addEventListener("click", function (e){
                        window.open((chrome.runtime.getURL('options.html')));
                    }),
                    searchActionElement.addEventListener("click", function (e) {
                        e.preventDefault(), v();
                    }),
                    form1Element.addEventListener("keydown", function (e) {
                        13 === e.keyCode && (e.preventDefault(), v());
                    }),
                    searchBoxDropDownElement.addEventListener("click", function (e) {
                        // @ts-ignore
                        if (e.currentTarget.classList.contains("show")) return e.currentTarget.classList.remove("show"), void searchBoxDropDownMenuElement.classList.remove("show");
                        // @ts-ignore
                        e.currentTarget.classList.add("show");
                        // @ts-ignore
                        let o = e.currentTarget.getBoundingClientRect();
                        i.setStyles(searchBoxDropDownMenuElement, { position: "absolute", "will-change": "transform", top: "0px", left: "0px", transform: "translate3d(0px, " + o.height + "px, 0px)" }), searchBoxDropDownMenuElement.classList.add("show");
                    }),
                    searchBoxDropDownMenuElement.addEventListener("mouseleave", function (e) {
                        removeShow();
                    }),
                    searchOptionElement.addEventListener("click", function (e) {
                        application.loadOptions(function (e) {
                            // @ts-ignore
                            (document.getElementById("SearchBoxDiv").style.display = searchOptionElement.checked ? "block" : "none"), (e.siteSearch = searchOptionElement.checked), e.save();
                        });
                    }),
                    topSiteOptionElement.addEventListener("click", function (e) {
                        application.loadOptions(function (e) {
                            // @ts-ignore
                            (document.getElementById("TopSitesDiv").style.display = topSiteOptionElement.checked ? "block" : "none"), (e.topSites = topSiteOptionElement.checked), e.save();
                        });
                    }),
                    application.loadOptions(function (e) {
                        // @ts-ignore
                        e.siteSearch ? (searchOptionElement.checked = !0) : (document.getElementById("SearchBoxDiv").style.display = "none"),
                            // @ts-ignore
                            e.topSites ? (topSiteOptionElement.checked = !0) : (document.getElementById("TopSitesDiv").style.display = "none"),
                            (function (r) {
                                r.listCustomSearch(function (e) {
                                    for (var t = 0, o = e; t < o.length; t++) {
                                        var n = o[t],
                                            i = '<a class="searchbox__dropdown-item" href="#" data-url=' + n.url + ' data-value="' + n.name + '">' + n.name + "</a>";
                                        // @ts-ignore
                                        searchBoxDropDownMenuElement.insertAdjacentHTML("beforeend", i), n.isDefault && (searchBoxDropDownElement.setAttribute("data-value", n.name), (document.querySelector("#customSearchName").innerText = n.name));
                                    }
                                    searchBoxDropDownMenuElement.querySelectorAll("a").forEach(function (e, t) {
                                        e.addEventListener("click", function (e) {
                                            e.preventDefault();
                                            // @ts-ignore
                                            var t = e.target.getAttribute("data-value");
                                            // @ts-ignore
                                            removeShow(), (document.querySelector("#customSearchName").innerText = t), searchBoxDropDownElement.setAttribute("data-value", t), r.changeSearch(t);
                                        });
                                    });
                                });
                            })(e),
                            (function (iDunnosPrototype) {
                                iDunnosPrototype.listTopSites(function (quickLinksCollection) {
                                    for (let currentIndex = 0; currentIndex < quickLinksCollection.length; currentIndex++)
                                    {
                                        var currentQuickLInk = quickLinksCollection[currentIndex],
                                            r =
                                                ' <div class="topsites__site">\n            <a class="topsites__link" href="' +
                                                currentQuickLInk.url +
                                                '">\n                <div class="topsites__content">\n                    <img class="topsites__img" src="' +
                                                currentQuickLInk.image +
                                                '" />\n                    <span class="topsites__title">' +
                                                currentQuickLInk.title +
                                                "</span>\n                </div>\n            </a>";

                                        quickLinkCount++;
                                        let gridElementName = GetGridElementName(quickLinkCount);
                                        let gridElement = document.getElementById(gridElementName);
                                        gridElement.insertAdjacentHTML("beforeend", r);
                                    }
                                });
                            })(e);
                    }),
                    chrome.runtime.sendMessage("get_image", function (e) {
                        null != e && (bgElement.setAttribute("style", "background-image:url('" + encodeURI(e.fullImage) + "');"), (photoTitleElement.innerText = e.title), photoLinkElement.setAttribute("href", e.fullImage), (document.body.style.display = "block"));
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

function GetGridElementName(quickLinksCount){
    if (quickLinksCount <= 10)
        return "topsites-grid-1";
    else if (quickLinksCount >= 10 && quickLinkCount < 21)
        return "topsites-grid-2"
    else if (quickLinksCount >= 21 && quickLinkCount < 31)
        return "topsites-grid-3"
    else if (quickLinksCount >= 31)
        return "topsites-grid-4"
}
