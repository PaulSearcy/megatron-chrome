var badgeColor = "#3cad3c"
var xid = ''
var transformedUrl = ''
var localDomain = ''
window.disable = false

const disableExtensionCheck = async tab => {
    await chrome.storage.sync.get('switchIGX',  switchIGX => {
        window.disable = switchIGX.switchIGX === 'on' ? false : true
        chrome.storage.sync.get('blacklist', async blacklist => {
            console.log(blacklist)
            if(window.disable == false) {
                window.disable = tab.url.includes(blacklist.blacklist)
            }
            if(window.disable == false) {
                await getTransformedContentType(getTransformedUrl(tab.url, 6))
            } else {
                chrome.contextMenus.removeAll();
                await chrome.browserAction.setBadgeText({
                    text: "-"
                })
                await chrome.browserAction.setBadgeBackgroundColor({
                    color: '#f70202'
                })
            }
        })
    })
}

const copyTextToClipboard = text => {
    let copyFrom = document.createElement("textarea")
    copyFrom.textContent = text
    let body = document.getElementsByTagName('body')[0]
    body.appendChild(copyFrom)
    copyFrom.select()
    document.execCommand('copy')
    body.removeChild(copyFrom)
}

const getTransformedUrl = (currentUrl, signal) => currentUrl.includes('?') ? `${currentUrl}&tfrm=${signal}` : `${currentUrl}?tfrm=${signal}`

const disableIcon = () => {
    chrome.browserAction.setTitle({
        'title': ''
    });
    chrome.contextMenus.removeAll();
}

const setTitle = xid => {
    const menus = [
        {
            id: 'xid',
            title: xid,
            contexts: ['all'],
            onclick: () => copyTextToClipboard(xid)
        },
        {
            id: 'preview',
            title: 'preview',
            contexts: ['all'],
            onclick: async clickObject => {
                 chrome.storage.sync.get(
                    'domain',
                     domain => {
                         chrome.tabs.create({
                             url: `https://${domain.domain[0]}.ingeniuxondemand.com/DssPreview/${xid}.xml`
                        })
                    }
                )
            }
        },
        {
            id: 'staging',
            title: 'staging',
            contexts: ['all'],
            onclick: async clickObject => {
                 chrome.storage.sync.get(
                    'domain',
                    domain => {
                        chrome.tabs.create({
                            url: `http://${domain.domain[0]}staging.ingeniuxondemand.com/${xid}.xml`
                        })
                    }
                )
            }
        },
        {
            id: 'tfrm=4',
            title: 'tfrm=4',
            contexts: ['all'],
            onclick: async clickObject => {
                console.log(window.location)
                debugger
                chrome.tabs.create({
                    url: getTransformedUrl(clickObject.pageUrl, 4)
                })
            }
        },
        {
            id: 'tfrm=5',
            title: 'tfrm=5',
            contexts: ['all'],
            onclick: async clickObject => {
                chrome.tabs.create({
                    url: getTransformedUrl(clickObject.pageUrl, 5)
                })
            }
        },
        {
            id: 'tfrm=6',
            title: 'tfrm=6',
            contexts: ['all'],
            onclick: async clickObject => {
                chrome.tabs.create({
                    url: getTransformedUrl(clickObject.pageUrl, 6)
                })
            }
        }
    ]

    menus.forEach(menu => chrome.contextMenus.create(menu))
    chrome.browserAction.setTitle({
        'title': xid
    })
}

const cleartitle = () => chrome.browserAction.setTitle({
    'title': ''
})

const getXId = async url => {
    await chrome.browserAction.enable();
    await chrome.browserAction.setBadgeText({
        text: "+"
    });
    transformedUrl = url
    console.log('made it')
    let defaultOptions = transformedUrl.includes('DssPreview') ? { method: 'GET', credentials: 'include' } : { method: 'GET' }
    await fetch(url, defaultOptions)
        .then(res => res.json())
        .then(data => {
            xid = data[Object.keys(data)[0]].ID || ''
            chrome.contextMenus.removeAll();
            xid ? setTitle(xid) : cleartitle()
        })
}

const getTransformedContentType = async transformedUrl => {
    let defaultOptions = transformedUrl.includes('DssPreview') ? {method: 'HEAD',credentials: 'include'} : {method: 'HEAD'}
    let checkExists = await
    fetch(transformedUrl, defaultOptions)
        .then(res => res.headers.get('Content-Type').includes('json'))
    checkExists ? getXId(transformedUrl) : disableIcon()
}

// open new tab when the button is clicked
chrome.browserAction.onClicked.addListener(tab => {
    console.log(JSON.stringify(tab))
    chrome.tabs.getCurrent(() => {
        enabled = !enabled
        //copyTextToClipboard(xid)
    })
})

// check on pageload for JSON
chrome.tabs.onUpdated.addListener(async (tabID, changeInfo, tab) => {
    chrome.browserAction.setBadgeBackgroundColor({
        color: badgeColor
    })
    chrome.browserAction.setBadgeText({
        text: ""
    })
    disableExtensionCheck(tab)
})

// check the most recently activated tab for a JSON response
// to the tfrm=6 querystring
chrome.tabs.onActivated.addListener(async activeInfo => {
    chrome.storage.sync.get('domain', (item) => { localDomain = item[0] })
    console.log(localDomain)
    // how to fetch tab url using activeInfo.tabid
    await chrome.tabs.get(activeInfo.tabId, async tab =>{
        chrome.browserAction.setBadgeText({
            text: ""
        })
        chrome.browserAction.setBadgeBackgroundColor({
            color: badgeColor
        })
        disableExtensionCheck(tab)
    })
})

const getStorageInfo = () => chrome.storage.sync.get(null,items => console.log(items))
