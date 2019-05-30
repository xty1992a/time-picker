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


export const passiveFlag = (flag: boolean = false) => supportsPassive ? {passive: flag} : false

export function lockScroll(el: HTMLElement) {
    const position = {x: 0, y: 0}
    let maxScrollTop = 0
    el.addEventListener('touchstart', (e: TouchEvent) => {
        maxScrollTop = el.scrollHeight - el.clientHeight
        position.x = e.touches[0].clientX
        position.y = e.touches[0].clientY
    })

    el.addEventListener('touchmove', (e: TouchEvent) => {
        if (maxScrollTop <= 0) {
            e.preventDefault()
            return
        }
        const nowY = e.changedTouches[0].clientY
        if (nowY > position.y && el.scrollTop === 0) {
            e.preventDefault()
        }
        if (nowY < position.y && el.scrollTop >= maxScrollTop - el.clientHeight) {
            e.preventDefault()
        }
        position.y = nowY
    }, passiveFlag(false))
}
