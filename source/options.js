const updateBlackListStorage = () =>
    chrome.storage.sync.set(
        {
            'blacklist':Array
                        .from(
                            document.querySelectorAll('#blacklist li')
                        )
                        .map(element => element.innerText.slice(0,-1))
        }
    )

const updateDomainListStorage = () =>
    chrome.storage.sync.set(
        {
            'domain':Array
                     .from(
                         document.querySelectorAll('#domainList li')
                     )
                     .map(element => element.innerText.slice(0,-1))
        }
    )

const createBlacklistItem = text => {
    var li = document.createElement('li')
    li.innerText = text
    var span = document.createElement('span')
    span.innerText = 'X'
    span.addEventListener('click', function () {
        this.parentElement.remove()
        updateBlackListStorage()
    })
    li.appendChild(span)
    document.getElementById('blacklist').appendChild(li)
}

const createDomainListItem = text => {
    var li = document.createElement('li')
    li.innerText = text
    var span = document.createElement('span')
    span.innerText = 'X'
    span.addEventListener('click', function () {
        this.parentElement.remove()
        updateDomainListStorage()
    })
    li.appendChild(span)
    document.getElementById('domainList').appendChild(li)
}

document.addEventListener('DOMContentLoaded',async () => {
    await chrome.storage.sync
    .get(
        'blacklist',
        item => {
            item.blacklist
                .forEach(site =>
                    createBlacklistItem(site)
                )
            updateBlackListStorage()
        }
    )

    await chrome.storage.sync
        .get(
            'domain',
            item => {
                item.domain
                    .forEach(site =>
                        createDomainListItem(site)
                    )
                updateDomainListStorage()
            }
        )

    document.getElementById('blacklistAddOne').addEventListener('click', async () => {
        var li = document.createElement('li')
        li.innerText = document.getElementById('addOneInput').value
        var span = document.createElement('span')
        span.innerText = 'X'
        span.addEventListener('click',function(){
            this.parentElement.remove()
            updateBlackListStorage()
        })
        li.appendChild(span)
        document.getElementById('blacklist').appendChild(li)
        updateBlackListStorage()
    })

    document.getElementById('domainAddOne').addEventListener('click', async () => {
        var li = document.createElement('li')
        li.innerText = document.getElementById('domainInput').value
        var span = document.createElement('span')
        span.innerText = 'X'
        span.addEventListener('click', function () {
            this.parentElement.remove()
            updateDomainListStorage()
        })
        li.appendChild(span)
        document.getElementById('domainList').appendChild(li)
        updateDomainListStorage()
    })
})
