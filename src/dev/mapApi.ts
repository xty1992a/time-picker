let seed = 0

const jsonp = function (url: string) {
    return new Promise(resolve => {
        const callbackName: string = 'baidu_jsonp_callback__' + seed++;
        // @ts-ignore
        window[callbackName] = function (result) {
            resolve({result, success: result.status === 0, data: result.result})
        }
        const script = document.createElement('script')
        script.src = url + '&callback=' + callbackName;
        document.head.appendChild(script);
    })
}

const getUrl: (name: string) => string = name => `https://api.map.baidu.com/geocoder/v2/?address=${name}&output=json&ak=AYaM1mMV2BSChZjk9MuPFgCw`

export const geocoder: (address: string) => Promise<any> = address => jsonp(getUrl(encodeURIComponent(address)));
