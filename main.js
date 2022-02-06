window.addEventListener('load', async function () {
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        if (account) {
            document.getElementsByClassName('metamask-text')[0].innerText = account.substring(0, 4) + '...' + account.slice(-4);
            document.getElementsByClassName('signout')[0].style.display = '';
        }
    }
})
