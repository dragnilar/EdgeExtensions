// let quickLinkCount = 0;
import KeyEventEvent = chrome.input.ime.KeyEventEvent;
import request = chrome.permissions.request;

class QuickLink
{
    title: string;
    url: string;
    image: string;

    constructor(title, url, image)
    {
        this.title = title;
        this.url = url;
        this.image = image;
    }
}

class BingImage
{
    pageURl : string;
    thumbUrl : string;
    title : string;
    copyright : string;
    date: string;
    fullUrl: string;

    constructor(pageUrl, thumbUrl, title, copyright, date, fullUrl)
    {
        this.pageURl = pageUrl;
        this.thumbUrl = thumbUrl;
        this.title = title;
        this.copyright = copyright;
        this.date = date;
        this.fullUrl = fullUrl;
    }

}

let newTabQuickLinkCount = 0;
let searchActionElement: any = null,
    form1Element: Element = null,
    bgElement: Element = null,
    photoTitleElement: HTMLElement = null,
    photoLinkElement: Element = null,
    settingElement: Element = null,
    searchOptionElement: HTMLInputElement = null,
    topSiteOptionElement: HTMLInputElement = null,
    goToOptionsButtonElement: HTMLButtonElement = null,
    searchBoxContainerElement : HTMLElement,
    topSiteElement : HTMLElement,
    //Default settings
    searchRegion : string = "",
    bgDisplayMode : number = 2,
    showWebSearch : boolean = true,
    showBookmarkLinks : boolean = true;

window.onload = function ()
{
    chrome.storage.local.get(["region", "displayMode", "siteSearch", "showSearch", "showQuickLinks"], function (optionsArray)
    {
        SetOptionsAndGetBackground(optionsArray);
    });
    GetPageElements();
    HookUpEventListeners();
    SetupQuickLinks();
    document.body.style.display = "block";
}
function GetPageElements()
{
    searchActionElement = document.getElementById("search-action");
    form1Element = document.getElementById("form1");
    bgElement = document.getElementById("bg");
    photoTitleElement = document.getElementById("photoTitle");
    photoLinkElement = document.getElementById("photoLink");
    settingElement = document.getElementById("setting");
    searchOptionElement = document.getElementById("siteSearchOption") as HTMLInputElement;
    topSiteOptionElement = document.getElementById("topSitesOption") as HTMLInputElement;
    goToOptionsButtonElement = document.getElementById("GoToOptionsButton") as HTMLButtonElement;
    searchBoxContainerElement = document.getElementById("SearchBoxDiv");
    topSiteElement = document.getElementById("TopSitesDiv");
}
function HookUpEventListeners() {
        goToOptionsButtonElement.addEventListener("click", function (clickEventArgs){
            window.open((chrome.runtime.getURL('options.html')));
        });
        searchActionElement.addEventListener("click", function (clickEventArgs) {
            clickEventArgs.preventDefault(), RunSearchQuery();
        });
        form1Element.addEventListener("keydown", function (keyDownEventArgs: KeyboardEvent) {
            "Enter" === keyDownEventArgs.code && (keyDownEventArgs.preventDefault(), RunSearchQuery());
        });
        searchOptionElement.addEventListener("click", function () {
            searchBoxContainerElement.style.display = searchOptionElement.checked ? "block" : "none";
            showWebSearch = searchOptionElement.checked;
            chrome.storage.local.set({showSearch: showWebSearch});
        });
        topSiteOptionElement.addEventListener("click", function () {
            topSiteElement.style.display = topSiteOptionElement.checked ? "block" : "none";
            showBookmarkLinks = topSiteOptionElement.checked;
            chrome.storage.local.set({showQuickLinks: showBookmarkLinks});
        });

    }
function SetOptionsAndGetBackground(optionsArray)
{
    if (optionsArray.region != null)
        searchRegion = optionsArray.region;
    else
        chrome.storage.local.set({region: searchRegion});
    if (optionsArray.displayMode != null)
        bgDisplayMode = optionsArray.displayMode;
    else
        chrome.storage.local.set({displayMode: bgDisplayMode});
    if (optionsArray.showSearch != null)
    {
        showWebSearch = optionsArray.showSearch;
        searchOptionElement.checked = showWebSearch;
        searchBoxContainerElement.style.display = searchOptionElement.checked ? "block" : "none";
    }
    else
    {
        chrome.storage.local.set({showSearch: showWebSearch});
        searchOptionElement.checked = true;
    }
    if (optionsArray.showQuickLinks != null)
    {
        showBookmarkLinks = optionsArray.showQuickLinks;
        topSiteOptionElement.checked = showBookmarkLinks;
        topSiteElement.style.display = topSiteOptionElement.checked ? "block" : "none";
    }
    else
    {
        chrome.storage.local.set({showQuickLinks: showBookmarkLinks});
        topSiteOptionElement.checked = true;
    }
    GetBackground()
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
            r = '<td>' +
                ' <div class="topsites__site">\n            <a class="topsites__link" href="' +
                currentQuickLInk.url +
                '">\n                <div class="topsites__content">\n                    <img class="topsites__img" src="' +
                currentQuickLInk.image +
                '" />\n                    <span class="topsites__title">' +
                currentQuickLInk.title +
                "</span>\n                </div>\n            </a> </td>";

        newTabQuickLinkCount++;
        let gridElementName = GetGridElementName(newTabQuickLinkCount);
        let gridElement = document.getElementById(gridElementName);
        gridElement.insertAdjacentHTML("beforeend", r);
    }
}

function GetBookMarkFavicon(bookMarkUrl){
    return "chrome://favicon/size/64/" + bookMarkUrl;
}

function RunSearchQuery() {
        // @ts-ignore
        let e = form1Element.value.trim();
        if ("" != e) {
            var t = "https://www.bing.com/search?q={0}";
            let n = t.replace("{0}", e);
            chrome.tabs.update({ url: n });
        }
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

function GetBackground()
{
    let urlEnd = searchRegion != "" ? '?country=' + searchRegion : "";
    let url = "https://peapix.com/bing/feed" + urlEnd;
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function ()
    {
        if (request.readyState == XMLHttpRequest.DONE && request.status == 200)
        {
            let imageCollection = <BingImage[]>JSON.parse(request.responseText);
            let selectedImage : BingImage;
            if (bgDisplayMode === 2)
            {
                selectedImage = imageCollection[Math.floor(Math.random() * imageCollection.length)];
            }
            else
            {
                selectedImage = imageCollection[0];
            }
            bgElement.setAttribute("style", "background-image:url('" + encodeURI(selectedImage.fullUrl) + "');"),
                (photoTitleElement.innerText = selectedImage.title),
                photoLinkElement.setAttribute("href", selectedImage.fullUrl),
                (document.body.style.display = "block");
        }
    }
    request.send();

}
