window.onload = () => {
    document.querySelector('.loading').style.display = 'none'
    document.querySelector('.card-bg').classList.remove('hide')
    document.querySelector('.load').classList.remove('hide')
}

let letterLoaded = false
let musicPlayed = false

document.addEventListener('click', () => {
    if (!musicPlayed) {
        document.querySelector('#music').play()
        musicPlayed = true
    }
})

// document.querySelector('.card .next').addEventListener('click', () => {
//     const page1ELements = document.querySelectorAll('.card>*')
//     const page2ELements = document.querySelectorAll('.card2>*')
//     let timeAnimation = 500
//     page1ELements.forEach((elm, i) => {
//         elm.style.animation = `hide-up ${i * 0.2}s .5s linear forwards`
//         timeAnimation += 200
//     })
//     setTimeout(() => {
//         document.querySelector('.card2').classList.remove('hide')
//         document.querySelector('.card').classList.add('hide')
//         page2ELements.forEach((elm, i) => {
//             elm.style.animation = `show-up .5s linear forwards`
//             elm.style.opacity = '1'
//         })
//         page1ELements.forEach((elm, i) => {
//             elm.style.opacity = '0'
//         })
//         if(!letterLoaded) {
//             typing(typing(0, '.card2 .content'), '.card2 .signature')
//             letterLoaded = true
//         }
//     }, timeAnimation)
// })

// document.querySelector('.card2 .pre').addEventListener('click', () => {
//     const page1ELements = document.querySelectorAll('.card>*')
//     const page2ELements = document.querySelectorAll('.card2>*')
//     let timeAnimation = 500
//     page2ELements.forEach((elm, i) => {
//         elm.style.animation = `hide-down ${i * 0.2}s .5s linear forwards`
//         timeAnimation += 200
//     })
//     setTimeout(() => {
//         document.querySelector('.card').classList.remove('hide')
//         document.querySelector('.card2').classList.add('hide')
//         page1ELements.forEach((elm, i) => {
//             elm.style.animation = `show-down .5s linear forwards`
//             elm.style.opacity = '1'
//         })
//         page1ELements.forEach((elm, i) => {
//             elm.style.opacity = '1'
//         })
//     }, timeAnimation)
// })

// document.querySelector('.card2 .next').addEventListener('click', () => {
//     const page1ELements = document.querySelectorAll('.card2>*')
//     const page2ELements = document.querySelectorAll('.card3>*')
//     let timeAnimation = 500
//     page1ELements.forEach((elm, i) => {
//         elm.style.animation = `hide-up ${i * 0.2}s .5s linear forwards`
//         timeAnimation += 200
//     })
//     setTimeout(() => {
//         document.querySelector('.card3').classList.remove('hide')
//         document.querySelector('.card2').classList.add('hide')
//         page2ELements.forEach((elm, i) => {
//             elm.style.animation = `show-up .5s linear forwards`
//             elm.style.opacity = '1'
//         })
//         page2ELements.forEach((elm, i) => {
//             elm.style.opacity = '1'
//         })
//     }, timeAnimation)
// })

// document.querySelector('.card3 .pre').addEventListener('click', () => {
//     const page1ELements = document.querySelectorAll('.card2>*')
//     const page2ELements = document.querySelectorAll('.card3>*')
//     let timeAnimation = 500
//     page2ELements.forEach((elm, i) => {
//         elm.style.animation = `hide-down ${i * 0.2}s .5s linear forwards`
//         timeAnimation += 200
//     })
//     setTimeout(() => {
//         document.querySelector('.card2').classList.remove('hide')
//         document.querySelector('.card3').classList.add('hide')
//         page1ELements.forEach((elm, i) => {
//             elm.style.animation = `show-down .5s linear forwards`
//             elm.style.opacity = '1'
//         })
//         page1ELements.forEach((elm, i) => {
//             elm.style.opacity = '1'
//         })
//     }, timeAnimation)
// })

document.querySelector('.card .next').addEventListener('click', () => {
    changeScreen('.card', '.card2', 'up', () => {
        if (!letterLoaded) {
            typing(typing(0, '.card2 .content'), '.card2 .signature')
            letterLoaded = true
        }
    })
})

document.querySelector('.card2 .pre').addEventListener('click', () => {
    changeScreen('.card2', '.card', 'down')
})

document.querySelector('.card2 .next').addEventListener('click', () => {
    changeScreen('.card2', '.card3', 'up')
})

document.querySelector('.card3 .pre').addEventListener('click', () => {
    changeScreen('.card3', '.card2', 'down')
})

function changeScreen(screen1, screen2, up_down, callback = () => { }) {
    const page1Elm = document.querySelectorAll(`${screen1}>*`)
    const page2Elm = document.querySelectorAll(`${screen2}>*`)
    let timeAnimation = 500
    page1Elm.forEach((elm, i) => {
        if (up_down === 'up') {
            elm.style.animation = `hide-up ${i * 0.2}s .5s linear forwards`
        } else if (up_down === 'down') {
            elm.style.animation = `hide-down ${(page1Elm.length - i - 1) * 0.2}s .5s linear forwards`
        } else {
            elm.style.animation = `hide-opacity .1s linear forwards`
        }
        timeAnimation += 200
    })
    setTimeout(() => {
        page2Elm.forEach((elm, i) => {
            document.querySelector(screen1).classList.add('hide')
            document.querySelector(screen2).classList.remove('hide')
            elm.style.animation = `show-${up_down} .5s linear forwards`
        })
        callback()
    }, timeAnimation)
}

function typing(delay = 0, elmSelector, text = '', time = 80) {
    const elm = document.querySelector(elmSelector)
    if (!text) text = elm.innerHTML
    const len = text.length
    elm.innerHTML = ''
    if (!len) return delay
    setTimeout(() => {
        let i = 0
        const interval = setInterval(() => {
            elm.innerHTML += text[i]
            if (++i >= len) clearInterval(interval)
        }, time)
    }, delay)
    return delay + time * len
}

function load() {
    const canvas = document.querySelector('#load-heart')
    const ctx = canvas.getContext('2d')
    canvas.width = 200
    canvas.height = 200

    ctx.beginPath()
    ctx.fillStyle = '#eddfd2'
    ctx.fillRect(0, 0, 200, 200)
    ctx.closePath()

    ctx.save()
    ctx.beginPath()
    ctx.moveTo(100, 50)
    ctx.lineTo(150, 100)
    ctx.lineTo(100, 150)
    ctx.lineTo(50, 100)
    ctx.arc(75, 75, 25 * Math.sqrt(2), 0, Math.PI * 2)
    ctx.moveTo(125, 75)
    ctx.arc(125, 75, 25 * Math.sqrt(2), 0, Math.PI * 2)
    ctx.clip()
    ctx.clearRect(0, 0, 200, 200)
    ctx.restore()
}

load()
let loadPercent = 30
const percentElm = document.querySelector('.load .percent span')
const loadHeartInterval = setInterval(() => {
    loadPercent = Math.max(loadPercent - 2, 30)
    percentElm.style.height = `${loadPercent}%`
}, 100)
document.querySelector('.load').addEventListener('click', () => {
    loadPercent += 5
    percentElm.style.height = `${loadPercent}%`
    if (loadPercent >= 81) {
        clearInterval(loadHeartInterval)
        document.querySelector('.load h2').innerHTML = '✔'
        document.querySelector('.load').style.opacity = 0
        setTimeout(() => {
            changeScreen('.load', '.card', 'up')
            // changeScreen('.card-bg', '.card')
        }, 500)
    }
})
typing(0, '.load h2')

const socket = io()

document.querySelector('#send').addEventListener('click', () => {
    const data = {
        content: document.querySelector('#message').value.trim(),
        signature: document.querySelector('#message-signature').value.trim()
    }

    const id = document.querySelector('.id').getAttribute('data--id')
    socket.emit('client-send', {id: id, data: data})

    const fbid = document.querySelector('.fbid').getAttribute('data--fbid')
    if( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        window.location.replace(`fb-messenger://user-thread/${fbid}`);
    } else {
        window.open(`https://messenger.com/t/${fbid}`)
    }
})
