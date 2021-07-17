// let quickLinkCount = 0;
let newTabQuickLinkCount = 0;
let searchBoxDropDownElement = null,
    searchBoxDropDownMenuElement = null,
    searchActionElement = null,
    form1Element = null,
    bgElement = null,
    photoTitleElement = null,
    photoLinkElement = null,
    settingElement = null,
    settingsDialogElement = null,
    searchOptionElement = null,
    topSiteOptionElement = null,
    closeSettingsElement = null,
    //Default settings
    searchRegion = "https://www.bing.com/search?`={0}",
    bgDisplayMode = 2,
    webSearchSite = null,
    showWebSearch = true,
    showBookmarkLinks = true;

window.onload = function ()
{
    chrome.storage.local.get(["region", "displayMode", "siteSearch", "showSearch", "showQuickLinks"], function (optionsArray)
    {
        SetOptionsOrReplaceWithDefaults(optionsArray);
    });
    NewTabPage();
    GetPageElements();
    SetupQuickLinks();
    document.body.style.display = "block";
}
function NewTabPage()
{
}
function GetPageElements()
{
    searchBoxDropDownElement = document.querySelector(".searchbox__dropdown");
    searchBoxDropDownMenuElement = document.querySelector(".searchbox__dropdown-menu");
    searchActionElement = document.getElementById("search-action");
    form1Element = document.getElementById("form1");
    bgElement = document.getElementById("bg");
    photoTitleElement = document.getElementById("photoTitle");
    photoLinkElement = document.getElementById("photoLink");
    settingElement = document.getElementById("setting");
    settingsDialogElement = document.querySelector(".settings__dialog");
    searchOptionElement = document.getElementById("siteSearchOption");
    topSiteOptionElement = document.getElementById("topSitesOption");
    closeSettingsElement = document.querySelector(".settings__dialog-close");
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
