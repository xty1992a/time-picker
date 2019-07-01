import * as GPS_convert from './GPS_convert'
import {isWechat} from './device-type'

export interface Result {
    success: boolean,
    message?: string,
    data?: {
        latitude: number,
        longitude: number,
        origin_latitude?: number,
        origin_longitude?: number,
    }

}

function initWx() {
    return new Promise((resolve, reject) => {
        try {
            // @ts-ignore
            const sdkConfigEl: HTMLInputElement = document.getElementById('sdkConfig')
            const sdkConfig = sdkConfigEl.value
            // @ts-ignore
            if (window.wx) {
                // @ts-ignore
                resolve(window.wx)
                return
            }
            // @ts-ignore
            if (sdkConfig) {
                loadScript('https://res.wx.qq.com/open/js/jweixin-1.4.0.js')
                    .then(() => {
                        const sdkConfigJson = JSON.parse(sdkConfig);
                        // @ts-ignore
                        window.wx.config(sdkConfigJson);//初始化
                        /// @ts-ignore
                        window.wx.ready(function () {
                            // @ts-ignore
                            resolve(window.wx)
                        })
                    })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const loadScript = (url: string) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = url
        script.addEventListener('load', resolve)
        script.addEventListener('error', reject)
        document.head.appendChild(script)
    })
}
export const getPositionByWx = () => new Promise(async (resolve: ResolveFn) => {
    try {
        await initWx()
        // @ts-ignore
        window.wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res: any) {
                const point = GPS_convert.gcj02_To_Bd09(res.longitude, res.latitude)
                resolve({
                    success: true,
                    data: {
                        origin_latitude: res.latitude,
                        origin_longitude: res.longitude,
                        latitude: point.lat,
                        longitude: point.lng,
                    }
                })
            },
            cancel: function (e: any) {
                throw new Error(e.message || '获取经纬度失败!')
            },
            fail: function (e: any) {
                throw new Error(e.message || '获取经纬度失败!')
            }
        });
    } catch (e) {
        console.log('fallback to baidu')
        const result = await getPositionByBaidu()
        console.log(result)
        resolve(result)
    }
})

export interface ResolveFn {
    (payload: Result): void
}

export const getPositionByBaidu = async (callback?: Function) => new Promise(async (resolve: ResolveFn) => {
    console.log('get position by baidu')
    // @ts-ignore
    window.getpositionbybaidumaploaded = () => {
        // @ts-ignore
        try {
            // @ts-ignore
            const geolocation = new window.BMap.Geolocation();
            geolocation.getCurrentPosition((res: any) => {
                const {lng, lat} = res.point
                const result = {
                    success: true,
                    data: {
                        latitude: lat,
                        longitude: lng
                    }
                }
                console.log(result, resolve)
                callback && callback(result)
                resolve(result)
            }, (e: any) => {
                callback && callback({success: false, message: e.message || 'get position failed'})
                resolve({success: false, message: e.message || 'get position failed'})
            }, {
                enableHighAccuracy: true,
                timeout: 2500,
            });
        } catch (e) {
            callback && callback({message: e.message || ' get position error !', success: false})
            resolve({
                message: e.message || ' get position error !',
                success: false
            })
        }
    }
    // @ts-ignore
    if (!window.BMap) {
        loadScript('https://api.map.baidu.com/api?v=2.0&ak=AYaM1mMV2BSChZjk9MuPFgCw&callback=getpositionbybaidumaploaded')
    }
    else {
        console.log(' bmap ')
        // @ts-ignore
        window.getpositionbybaidumaploaded()
    }
})

export const getPosition = isWechat ? getPositionByWx : getPositionByBaidu
