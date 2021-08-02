// let quickLinkCount = 0;
import KeyEventEvent = chrome.input.ime.KeyEventEvent;
import request = chrome.permissions.request;
import QueryInfo = chrome.search.QueryInfo;


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
    form1Element: HTMLFormElement = null,
    photoTitleElement: HTMLElement = null,
    photoLinkElement: Element = null,
    settingElement: Element = null,
    searchOptionElement: HTMLInputElement = null,
    quickLinksOptionElement: HTMLInputElement = null,
    goToOptionsButtonElement: HTMLButtonElement = null,
    searchBoxContainerElement : HTMLElement,
    quickLinksElement : HTMLElement,
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
    form1Element = document.getElementById("form1") as HTMLFormElement;
    photoTitleElement = document.getElementById("photoTitle");
    photoLinkElement = document.getElementById("photoLink");
    settingElement = document.getElementById("setting");
    searchOptionElement = document.getElementById("siteSearchOption") as HTMLInputElement;
    quickLinksOptionElement = document.getElementById("QuickLinksOption") as HTMLInputElement;
    goToOptionsButtonElement = document.getElementById("GoToOptionsButton") as HTMLButtonElement;
    searchBoxContainerElement = document.getElementById("SearchBoxDiv");
    quickLinksElement = document.getElementById("QuickLinksDiv");
}
function HookUpEventListeners() {
        goToOptionsButtonElement.addEventListener("click", function (){
            window.open((chrome.runtime.getURL('options.html')));
        });
        searchActionElement.addEventListener("click", function (clickEventArgs) {
            clickEventArgs.preventDefault(),
            RunSearchQuery();
        });
        form1Element.addEventListener("keydown", function (keyDownEventArgs: KeyboardEvent) {
            "Enter" === keyDownEventArgs.code && (keyDownEventArgs.preventDefault(), RunSearchQuery());
        });
        searchOptionElement.addEventListener("click", function () {
            searchBoxContainerElement.style.display = searchOptionElement.checked ? "block" : "none";
            showWebSearch = searchOptionElement.checked;
            chrome.storage.local.set({showSearch: showWebSearch});
        });
        quickLinksOptionElement.addEventListener("click", function () {
            quickLinksElement.style.display = quickLinksOptionElement.checked ? "block" : "none";
            showBookmarkLinks = quickLinksOptionElement.checked;
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
    // noinspection DuplicatedCode
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
    // noinspection DuplicatedCode
    if (optionsArray.showQuickLinks != null)
    {
        showBookmarkLinks = optionsArray.showQuickLinks;
        quickLinksOptionElement.checked = showBookmarkLinks;
        quickLinksElement.style.display = quickLinksOptionElement.checked ? "block" : "none";
    }
    else
    {
        chrome.storage.local.set({showQuickLinks: showBookmarkLinks});
        quickLinksOptionElement.checked = true;
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
                ' <div class="QuickLinkSite">\n            <a class="QuickLinkUrlLink" href="' +
                currentQuickLInk.url +
                '">\n                <div class="QuickLinksContent">\n                    <img class="QuickLinkBookMarkImage" src="' +
                currentQuickLInk.image +
                '" alt="'+
                currentQuickLInk.title +
                '" /> <span class="QuickLinkTitle">' +
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
        let queryString : string = form1Element.value.trim();
        chrome.search.query({text: queryString, disposition: "CURRENT_TAB"}, () =>
        {
            console.log(queryString)
        });
    }

// @ts-ignore
function GetGridElementName(quickLinksCount){
    if (quickLinksCount <= 12)
        return "QuickLinks-grid-1";
    else if (quickLinksCount >= 12 && newTabQuickLinkCount < 25)
        return "QuickLinks-grid-2"
    else if (quickLinksCount >= 25 && newTabQuickLinkCount < 37)
        return "QuickLinks-grid-3"
    else if (quickLinksCount >= 37)
        return "QuickLinks-grid-4"
}

function GetBackground()
{
    let urlEnd = searchRegion != "" ? '?country=' + searchRegion : "";
    let url = "https://peapix.com/bing/feed" + urlEnd;
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function ()
    {
        try
        {
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200)
            {
                let imageCollection = <BingImage[]>JSON.parse(request.responseText);
                let selectedImage: BingImage;
                if (bgDisplayMode === 2)
                {
                    selectedImage = imageCollection[Math.floor(Math.random() * imageCollection.length)];
                } else
                {
                    selectedImage = imageCollection[0];
                }
                document.body.setAttribute("style", "background-image:url('" + encodeURI(selectedImage.fullUrl) + "');"),
                    (photoTitleElement.innerText = selectedImage.title),
                    photoLinkElement.setAttribute("href", selectedImage.fullUrl),
                    (document.body.style.display = "block");

            }
        }
        catch (e)
        {
            console.log("Error getting background image:" + e.title + " " + e.stackTrace);
        }
    }
    request.send();

}
