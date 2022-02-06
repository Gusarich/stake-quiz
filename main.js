async function updateData () {
    const totalStake = parseFloat(await contract.methods.totalStake().call()) / 1e18

    if (ethereum.selectedAddress) {
        window.balance = parseFloat(await token.methods.balanceOf(ethereum.selectedAddress).call()) / 1e18
        window.stake = parseFloat(await contract.methods.stakes(ethereum.selectedAddress).call()) / 1e18
        window.allowance = parseFloat(await token.methods.allowance(ethereum.selectedAddress, '0x91BaE0FDaa34022Ccf2069bC00bFAe85f2Fd1220').call()) / 1e18
        const chance = (window.stake / totalStake) * 100

        if (window.allowance < 1000000) {
            // need to approve first
            document.getElementById('stake').style.display = 'none'
            document.getElementById('unstake').style.display = 'none'
            document.getElementById('approve').style.display = ''
        }
        else {
            document.getElementById('stake').style.display = ''
            document.getElementById('unstake').style.display = ''
            document.getElementById('approve').style.display = 'none'
        }

        document.getElementsByClassName('metamask-text')[0].innerText = ethereum.selectedAddress.substring(0, 4) + '...' + ethereum.selectedAddress.slice(-4)
        document.getElementsByClassName('signout')[0].style.display = ''
        document.getElementById('_balance').innerText = window.balance.toFixed(2)
        document.getElementById('_stake').innerText = window.stake.toFixed(2)
        document.getElementById('_chance').innerText = chance.toFixed(2)
    }

    document.getElementById('_totalStake').innerText = totalStake.toFixed(2)
}

async function ethEnabled () {
    if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        window.web3 = new Web3(window.ethereum)
        return true
    }
    return false
}

function stake () {
    let amount = parseFloat(document.getElementsByName('amount')[0].value)
    if (amount > 0 && amount <= window.balance && amount <= window.allowance) {
        amount = web3.utils.toWei(amount.toFixed(18), 'ether')
        document.getElementsByClassName('loader')[0].style.display = ''
        window.contract.methods.stake(amount).send({ from: ethereum.selectedAddress }).then((res) => {
            console.log(res)
            updateData()
        }).catch((e) => {
            console.log('error')
        }).finally(() => {
            document.getElementsByClassName('loader')[0].style.display = 'none'
        })
    }
}

function unstake () {
    let amount = parseFloat(document.getElementsByName('amount')[0].value)
    if (amount > 0 && amount <= window.stake) {
        amount = web3.utils.toWei(amount.toFixed(18), 'ether')
        document.getElementsByClassName('loader')[0].style.display = ''
        window.contract.methods.unstake(amount).send({ from: ethereum.selectedAddress }).then((res) => {
            console.log(res)
            updateData()
        }).catch((e) => {
            console.log('error')
        }).finally(() => {
            document.getElementsByClassName('loader')[0].style.display = 'none'
        })
    }
}

function approve () {
    amount = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
    document.getElementsByClassName('loader')[0].style.display = ''
    window.token.methods.approve('0x91BaE0FDaa34022Ccf2069bC00bFAe85f2Fd1220', amount).send({ from: ethereum.selectedAddress }).then((res) => {
        console.log(res)
        updateData()
    }).catch((e) => {
        console.log('error')
    }).finally(() => {
        document.getElementsByClassName('loader')[0].style.display = 'none'
    })
}

window.addEventListener('load', async function () {
    document.getElementById('stake').onclick = stake
    document.getElementById('unstake').onclick = unstake
    document.getElementById('approve').onclick = approve

    if (await ethEnabled()) {
        window.contract = new web3.eth.Contract(
            [{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"winner","type":"address"}],"name":"Draw","type":"event"},{"inputs":[],"name":"draw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"stakes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStake","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"unstake","outputs":[],"stateMutability":"nonpayable","type":"function"}],
            '0x91BaE0FDaa34022Ccf2069bC00bFAe85f2Fd1220')

        window.token = new web3.eth.Contract(
            [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"}],"name":"init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}],
            '0xf63C81412e29B4A45AB1ecc238b18A7E8F72A8c8')

        updateData()
        ethereum.on('accountsChanged', (accounts) => {
            updateData()
        })
        setInterval(updateData, 3000)
    }
})
