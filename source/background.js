var badgeColor = "#3cad3c";
var xid = ''

const getTransformedUrl = currentUrl => currentUrl.includes('?') ? `${currentUrl}&tfrm=6` : `${currentUrl}?tfrm=6`

const disableIcon = () => {
    chrome.browserAction.disable();
    chrome.browserAction.setTitle({'title': ''});
    chrome.contextMenus.removeAll();
}

const setTitle = xid => {
    chrome.contextMenus.create({'title':xid})
    chrome.browserAction.setTitle({'title':xid})
}

const cleartitle = () => chrome.browserAction.setTitle({'title':''})

const getXId = async url => {
    chrome.browserAction.enable();
    chrome.browserAction.setBadgeText({text: "+"});
    await fetch(url,{method: 'GET'})
    .then(res => res.json())
    .then(data =>{
        xid = data[Object.keys(data)[0]].ID || ''
        chrome.contextMenus.removeAll();
        xid ? setTitle(xid) : cleartitle()
    })
}

const getTransformedContentType = async transformedUrl => {
    let checkExists = await
        fetch(transformedUrl,{method: 'HEAD',})
        .then(res => res.headers.get('Content-Type').includes('json'))
    checkExists ? getXId(transformedUrl) : disableIcon()
}

// open new tab when the button is clicked
chrome.browserAction.onClicked.addListener(tab => {
    chrome.tabs.getCurrent(() => {
        const copyTextToClipboard = text => {
            let copyFrom = document.createElement("textarea")
            copyFrom.textContent = text
            let body = document.getElementsByTagName('body')[0]
            body.appendChild(copyFrom)
            copyFrom.select()
            document.execCommand('copy')
            body.removeChild(copyFrom)
        }
        copyTextToClipboard(xid)
    })
})

// check on pageload for JSON
chrome.tabs.onUpdated.addListener(async (tabID, changeInfo, tab) => {
  chrome.browserAction.setBadgeBackgroundColor({color:badgeColor})
  chrome.browserAction.setBadgeText({text:""})
  await getTransformedContentType( getTransformedUrl(tab.url) )
})

// check the most recently activated tab for a JSON response
// to the tfrm=6 querystring
chrome.tabs.onActivated.addListener(async activeInfo => {
    chrome.browserAction.setBadgeText({text:""})
    chrome.browserAction.setBadgeBackgroundColor({color:badgeColor});
    // how to fetch tab url using activeInfo.tabid
    chrome.tabs.get(activeInfo.tabId, async tab =>
        await getTransformedContentType( getTransformedUrl(tab.url) )
    )
})
