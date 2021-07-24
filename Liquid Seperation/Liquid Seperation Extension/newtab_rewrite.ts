// let quickLinkCount = 0;
import KeyEventEvent = chrome.input.ime.KeyEventEvent;

let newTabQuickLinkCount = 0;
let searchBoxDropDownElement: Element = null,
    searchBoxDropDownMenuElement : HTMLElement = null,
    searchActionElement : any = null,
    form1Element : Element = null,
    bgElement: Element = null,
    photoTitleElement: Element = null,
    photoLinkElement: Element = null,
    settingElement: Element = null,
    settingsDialogElement: HTMLElement = null,
    searchOptionElement: HTMLInputElement = null,
    topSiteOptionElement: HTMLInputElement = null,
    closeSettingsElement: HTMLInputElement = null,
    goToOptionsButtonElement: HTMLButtonElement = null,
    //Default settings
    searchRegion : string = "https://www.bing.com/search?`={0}",
    bgDisplayMode : number = 2,
    webSearchSite : string = null,
    showWebSearch : boolean = true,
    showBookmarkLinks : boolean = true;

window.onload = function ()
{
    chrome.storage.local.get(["region", "displayMode", "siteSearch", "showSearch", "showQuickLinks"], function (optionsArray)
    {
        SetOptionsOrReplaceWithDefaults(optionsArray);
    });
    GetPageElements();
    HookUpEventListeners();
    SetupQuickLinks();
    document.body.style.display = "block";
}
function GetPageElements()
{
    searchBoxDropDownElement = document.querySelector(".searchbox__dropdown");
    searchBoxDropDownMenuElement = document.querySelector(".searchbox__dropdown-menu");
    searchActionElement = document.querySelector("search-action");
    form1Element = document.getElementById("form1");
    bgElement = document.getElementById("bg");
    photoTitleElement = document.getElementById("photoTitle");
    photoLinkElement = document.getElementById("photoLink");
    settingElement = document.getElementById("setting");
    settingsDialogElement = document.querySelector(".settings__dialog");
    searchOptionElement = document.querySelector("siteSearchOption");
    topSiteOptionElement = document.querySelector("topSitesOption");
    closeSettingsElement = document.querySelector(".settings__dialog-close");
    goToOptionsButtonElement = document.querySelector(".GoToOptionsButton");
}
function HookUpEventListeners() {
    settingElement.addEventListener("click", function (clickEventArgs) {
        if (settingsDialogElement.classList.contains("show"))
            settingsDialogElement.classList.remove("show");
        else {
            // @ts-ignore
            clickEventArgs.currentTarget.getBoundingClientRect();
            settingsDialogElement.style.setProperty("position", "absolute");
            settingsDialogElement.style.setProperty("will-change", "transform");
            settingsDialogElement.style.setProperty("top", "0px");
            settingsDialogElement.style.setProperty("left", "0px");
            settingsDialogElement.style.setProperty("transform", "\"translate3d(\" + (o.left - 260) + \"px, \" + o.height + \"px, 0px)\"");
            settingsDialogElement.classList.add("show");
        }});
        goToOptionsButtonElement.addEventListener("click", function (clickEventArgs){
            window.open((chrome.runtime.getURL('options.html')));
        });
        searchActionElement.addEventListener("click", function (clickEventArgs) {
            clickEventArgs.preventDefault(), SetSearchActionElement();
        });
        form1Element.addEventListener("keydown", function (keyDownEventArgs: KeyboardEvent) {
            "13" === keyDownEventArgs.code && (keyDownEventArgs.preventDefault(), SetSearchActionElement());
        });
        searchBoxDropDownElement.addEventListener("click", function (args) {
            // @ts-ignore
            if (args.currentTarget.classList.contains("show")) return args.currentTarget.classList.remove("show"), void searchBoxDropDownMenuElement.classList.remove("show");
            // @ts-ignore
            args.currentTarget.classList.add("show");
            // @ts-ignore
            let o = args.currentTarget.getBoundingClientRect();
            searchBoxDropDownMenuElement.style.setProperty("position", "absolute");
            searchBoxDropDownMenuElement.style.setProperty("will-change", "transform");
            searchBoxDropDownMenuElement.style.setProperty("top", "0px");
            searchBoxDropDownMenuElement.style.setProperty("left", "0px");
            searchBoxDropDownMenuElement.style.setProperty("transform", "translate3d(0px, " + o.height + "px, 0px)");
            searchBoxDropDownMenuElement.classList.add("show");
        });
        searchBoxDropDownMenuElement.addEventListener("mouseleave", function (args) {
            removeShow();
        });
        searchOptionElement.addEventListener("click", function () {
            var searchBoxContainerElement = document.getElementById("SearchBoxDiv");
            searchBoxContainerElement.style.display = searchOptionElement.checked ? "block" : "none";
            showWebSearch = searchOptionElement.checked;
            chrome.storage.local.set({showSearch: showWebSearch});
        });
        closeSettingsElement.addEventListener("click", function () {
            settingsDialogElement.classList.remove("show");
        });
        topSiteOptionElement.addEventListener("click", function () {
            var topSiteElement = document.getElementById("TopSitesDiv");
            topSiteElement.style.display = topSiteOptionElement.checked ? "block" : "none";
            showBookmarkLinks = topSiteOptionElement.checked;
            chrome.storage.local.set({showQuickLink: showBookmarkLinks});
        });

    }
function SetOptionsOrReplaceWithDefaults(optionsArray)
{
    if (optionsArray.region != null)
        searchRegion = optionsArray.region;
    else
        chrome.storage.local.set({region: searchRegion});
    if (optionsArray.displayMode != null)
        bgDisplayMode = optionsArray.displayMode;
    else
        chrome.storage.local.set({displayMode: bgDisplayMode});
    if (optionsArray.siteSearch != null)
        webSearchSite = optionsArray.siteSearch;
    else
        chrome.storage.local.set({siteSearch: webSearchSite});
    if (optionsArray.showSearch != null)
        showWebSearch = optionsArray.showSearch;
    else
        chrome.storage.local.set({showSearch: showWebSearch});
    if (optionsArray.showQuickLinks != null)
        showBookmarkLinks = optionsArray.showQuickLinks;
    else
        chrome.storage.local.set({showQuickLink: showBookmarkLinks});
}

class QuickLink
    {
        title : string;
        url : string;
        image : string;
    constructor(title, url, image)
    {
        this.title = title;
        this.url = url;
        this.image = image;
    }
}

function SetupQuickLinks()
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
        var quickLinkList = [];
        chrome.bookmarks.getChildren(node[0].id, function(edgeQuickLinks)
        {
            for (let index = 0; index < edgeQuickLinks.length; index++)
            {
                const currentBookMark = edgeQuickLinks[index];
                const quickLink = new QuickLink(currentBookMark.title, currentBookMark.url, GetBookMarkFavicon(currentBookMark.url));
                quickLinkList.push(quickLink);

            }
            CreateQuickLinkTiles(quickLinkList);
        });
    });
}
function CreateQuickLinkTiles(quickLinkList)
{
    for (let currentIndex = 0; currentIndex < quickLinkList.length; currentIndex++)
    {
        var currentQuickLInk = quickLinkList[currentIndex],
            r =
                ' <div class="topsites__site">\n            <a class="topsites__link" href="' +
                currentQuickLInk.url +
                '">\n                <div class="topsites__content">\n                    <img class="topsites__img" src="' +
                currentQuickLInk.image +
                '" />\n                    <span class="topsites__title">' +
                currentQuickLInk.title +
                "</span>\n                </div>\n            </a>";

        newTabQuickLinkCount++;
        let gridElementName = GetGridElementName(newTabQuickLinkCount);
        let gridElement = document.getElementById(gridElementName);
        gridElement.insertAdjacentHTML("beforeend", r);
    }
}

function ResetOptions (){
    chrome.storage.local.remove(["region", "displayMode", "siteSearch", "showSearch", "showQuickLinks"]);
}
function GetBookMarkFavicon(bookMarkUrl){
    return "chrome://favicon/size/64/" + bookMarkUrl;
}

function SetSearchActionElement() {
        // @ts-ignore
        let e = form1Element.value.trim();
        if ("" != e) {
            var t = searchBoxDropDownElement.getAttribute("data-value"),
                o = searchBoxDropDownMenuElement.querySelector("[data-value='" + t + "']");
            if (null != o) {
                let n = searchActionElement.formatString(o.getAttribute("data-url"), encodeURIComponent(e));
                chrome.tabs.update({ url: n });
            }
        }
    }
function removeShow() {
    searchBoxDropDownElement.classList.remove("show"), searchBoxDropDownMenuElement.classList.remove("show");
}

// @ts-ignore
function GetGridElementName(quickLinksCount){
    if (quickLinksCount <= 10)
        return "topsites-grid-1";
    else if (quickLinksCount >= 10 && newTabQuickLinkCount < 21)
        return "topsites-grid-2"
    else if (quickLinksCount >= 21 && newTabQuickLinkCount < 31)
        return "topsites-grid-3"
    else if (quickLinksCount >= 31)
        return "topsites-grid-4"
}
