// @ts-ignore
const wx = window.wx

export interface Result {
    success: boolean,
    data?: {
        latitude: string,
        longitude: string,
    }

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
const getPositionByWx = () => new Promise((resolve:ResolveFn) => {
    wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res: any) {
            resolve({
                success: true,
                data: {
                    latitude: res.latitude,
                    longitude: res.longitude,
                }
            })
        }
    });
})
export interface ResolveFn {
    (payload: Result): void
}
const getPositionByBaidu = async () => new Promise(async (resolve: ResolveFn) => {
    // @ts-ignore
    window.maploaded = function () {
        // @ts-ignore
        try {
            // @ts-ignore
            const geolocation = new window.BMap.Geolocation();
            geolocation.getCurrentPosition(function (res: any) {
                console.log(res, 'getCurrentPosition')
                // @ts-ignore
                if (geolocation.getStatus() === window.BMAP_STATUS_SUCCESS) {
                    resolve({
                        success: true,
                        data: {
                            latitude: res.point.lat,
                            longitude: res.point.lng
                        }
                    })
                }
                else {
                    console.log(res, 'getCurrentPosition')
                    resolve({
                        success: false
                    })
                }
            }, () => {

            }, {
                enableHighAccuracy: true
            });
        } catch (e) {
            console.log(e.message)
            resolve({
                success: false
            })
        }
    }
    // @ts-ignore
    if (!window.BMap) {
        loadScript('https://api.map.baidu.com/api?v=2.0&ak=AYaM1mMV2BSChZjk9MuPFgCw&callback=maploaded')
    }
    else {
        // @ts-ignore
        window.maploaded()
    }
})

export const getPosition = wx ? getPositionByWx : getPositionByBaidu
