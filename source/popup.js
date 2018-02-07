document.addEventListener('DOMContentLoaded', function () {
    var enabled = ''
    chrome.storage.sync.get('switchIGX', item => {
        if(item) {
            document.getElementById('enabled').checked = item.switchIGX === 'on' ? true : false
        } else {
            chrome.storage.sync.set({ 'switchIGX': true })
            document.getElementById('enabled').checked = true
        }
    })

    document.getElementById('enabled').addEventListener('click',function(){
        chrome.storage.sync.set({'switchIGX':this.checked === true ? 'on' : 'off'})
    })

    chrome.storage.sync.set({'popup':JSON.stringify(this) || 'nothing'})
});
