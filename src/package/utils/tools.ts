let elementStyle = document.createElement('div').style

let vendor = (() => {
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform',
    }

    for (let key in transformNames) {
        // @ts-ignore
        if (elementStyle[transformNames[key]] !== undefined) {
            return key
        }
    }

    return false
})()

export function prefixStyle(style: string) {
    if (vendor === false) {
        return ''
    }

    if (vendor === 'standard') {
        if (style === 'transitionEnd') {
            return 'transitionend'
        }
        return style
    }

    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export function getParentByClassName(el: HTMLElement, className: string, stop = document.body) {
    if (el.classList.contains(className)) return el
    let parent = el.parentElement
    let target = null
    while (parent) {
        if (parent.classList.contains(className)) {
            target = parent
            parent = null
        }
        else {
            parent = parent.parentElement
            if (parent === stop) {
                parent = null
            }
        }
    }
    return target
}

interface ElementStyle {
    [propName: string]: string;
}

export function css(el: HTMLElement, style: ElementStyle) {
    Object.keys(style).forEach(k => {
        let val = style[k]
        if (['transform', 'transition'].includes(k)) {
            k = prefixStyle(k)
        }
        // @ts-ignore
        el.style[k] = val
    })
}

export const isMobile = (() => {
    var userAgentInfo = navigator.userAgent;
    var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return !flag;
})()

export function getObjectURL(file: File) {
    let url = null
    if (window.hasOwnProperty('createObjectURL') !== undefined) { // basic
        // @ts-ignore
        url = window.createObjectURL(file)
    }
    else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
    }
    else if (window.hasOwnProperty('webkitURL')) { // webkit or chrome
        // @ts-ignore
        url = window.webkitURL.createObjectURL(file)
    }
    return url
}

export function dataURLtoBlob(dataurl: string) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}
