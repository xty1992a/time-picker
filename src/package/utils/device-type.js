const ua = navigator.userAgent.toLowerCase()
export const  isWechat = /MicroMessenger/i.test(ua)
export const isAliLife = /alipayclient/i.test(ua)
export const isBrowser = !isWechat && !isAliLife
