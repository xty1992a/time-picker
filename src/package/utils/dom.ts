let supportsPassive = false;
try {
    const opts = Object.defineProperty({}, 'passive', {
        get: function () {
            supportsPassive = true;
        }
    });
    window.addEventListener("test", null, opts);
} catch (e) {
}
const stopFN = (e: Event) => e.preventDefault()


export const client = (() => {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return {
        android: isAndroid,
        ios: isiOS
    }
})()

let timer = 0

function creatModal() {
    clearTimeout(timer)
    console.log('creat modal')
    const el = document.getElementById('modal') || document.createElement('div')
    el.id = 'modal'
    el.style.position = 'fixed'
    el.style.left = 0 + ''
    el.style.right = 0 + ''
    el.style.top = 0 + ''
    el.style.bottom = 0 + ''
    el.style.zIndex = 99999 + ''
    document.body.appendChild(el)
    el.addEventListener('touchmove', stopFN, passiveFlag(false))
    timer = setTimeout(() => {
        el.remove()
    }, 50)
}

function holdTop(top: number) {
    return function (e: Event) {
        document.scrollingElement.scrollTop = top
    }
}

export const passiveFlag = (flag: boolean = false) => supportsPassive ? {passive: flag} : false

function lockScroll1(el: HTMLElement) {
    const position = {x: 0, y: 0}
    let maxScrollTop = 0
    let isTop = false, isBottom = false
    let pageY = document.scrollingElement.scrollTop
    let holdFn = (e: Event) => {
    }

    el.addEventListener('touchstart', (e: TouchEvent) => {
        e.stopPropagation()
        pageY = document.scrollingElement.scrollTop
        maxScrollTop = el.scrollHeight - el.clientHeight
        position.x = e.touches[0].clientX
        position.y = e.touches[0].clientY
        isTop = el.scrollTop === 0
        isBottom = el.scrollTop === maxScrollTop
        // document.removeEventListener('scroll', holdFn)
        // holdFn = holdTop(pageY)
        // document.addEventListener('scroll', holdFn)
    })

    el.addEventListener('touchmove', (e: TouchEvent) => {
        if (maxScrollTop <= 0) {
            return
        }
        const nowY = e.changedTouches[0].clientY
        if (nowY > position.y) {
            if (isTop) {
                console.log('touch from top & pan top')
                e.preventDefault()
                return
            }
            if (el.scrollTop <= 0) {
                // creatModal()
                e.preventDefault()
                document.scrollingElement.scrollTop = pageY
                el.scrollTop = 0
                setTimeout(() => {
                    document.scrollingElement.scrollTop = pageY
                })
            }
            isBottom = false
        }
        if (nowY < position.y) {
            if (isBottom) {
                console.log('touch from bottom & pan bottom')
                e.preventDefault()
                return
            }
            if (el.scrollTop >= maxScrollTop) {
                // creatModal()
                e.preventDefault()
                el.scrollTop = maxScrollTop
                setTimeout(() => {
                    document.scrollingElement.scrollTop = pageY
                })
            }
            isTop = false
        }
        position.y = nowY

        // stopFlag && e.stopPropagation()
    }, passiveFlag(false))

    el.addEventListener('touchend', () => {
        console.log('el touch end')
        // document.removeEventListener('scroll', holdFn)
        // document.removeEventListener('touchmove', stopFN)
    })
}

function lockScroll2(el: HTMLElement) {
    let pageY = document.scrollingElement.scrollTop
    const body = document.body
    const marginTop = parseInt(getComputedStyle(body)['marginTop'])

    const restore = () => {
        body.style.marginTop = marginTop + 'px'
        body.className = body.className.replace('scroll-locked', '')
        document.scrollingElement.scrollTop = pageY
        console.log('on touchend ', pageY)
        document.removeEventListener('touchend', restore)
    }

    el.addEventListener('touchstart', function () {
        pageY = document.scrollingElement.scrollTop
        console.log('on touchstart ', pageY)
        body.style.marginTop = marginTop + -pageY + 'px'
        if (!/scroll-locked/.test(body.className)) {
            body.className += ' scroll-locked '
        }
        document.addEventListener('touchend', restore)
    })

}

console.log(navigator.userAgent)

export const lockScroll = client.ios ? lockScroll1 : lockScroll2
