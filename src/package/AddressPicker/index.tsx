import * as preact from 'preact'
import Action from '../Action/index'
import './index.less'
import PointPicker from '../PointPicker/index'
import {getPosition} from '../utils/getPosition'
import {geocoder} from '../../dev/mapApi'

const sleep: (time: number) => any = (time) => new Promise(resolve => setTimeout(resolve, time))

const {Component, h, render} = preact


interface AddressPickerPops {
    resolve: Function,
    address?: string
    lat?: string
    lng?: string
    area?: string
}

interface PickAddressOptions {
    address?: string
    lat?: string
    lng?: string
    area?: string
}

export class AddressPicker extends Component<AddressPickerPops, any> {
    private _action: Action
    private _input: HTMLInputElement
    private _mapDom: HTMLElement

    state: {
        address: string,
        area: string,
        lng: string,
        lat: string,
        pointList: any[]
        pickedPoint: string
    }
    // @ts-ignore
    map: BMap.Map

    // @ts-ignore
    constructor(props: AddressPickerPops) {
        super(props);
        console.log('[created] ', props)
        this.initMap(this.afterInitMap, props)
    }

    async initMap(callback: Function, props: AddressPickerPops) {

        if (this.map) {
            callback(props)
        }
        await sleep(320)
        this._mapDom.addEventListener('mousewheel', e => {
            e.stopPropagation();
            e.stopImmediatePropagation();
        })
        // @ts-ignore
        this.map = new BMap.Map(this._mapDom);          // 创建地图实例
        callback(props)
        // @ts-ignore
        this.map.addControl(new BMap.GeolocationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));
        this.map.addEventListener("dragend", async () => {
                const center = this.map.getCenter();
                this.pointChange(center.lng, center.lat);
                console.log("地图中心点变更为：" + center.lng + ", " + center.lat)
            }
        );
    }

    afterInitMap = async (props: AddressPickerPops) => {
        try {
            const {address, area, lng, lat} = props
            // 如果有经纬度,尝试用经纬度定位,
            if (lng && lat) {
                console.log('[after init map] try to locate by location: ', lng, lat)
                this.setState({lng, lat})
                // @ts-ignore
                const point = new BMap.Point(lng, lat);  // 创建点坐标
                this.map.centerAndZoom(point, 15);
                this.pointChange(lng, lat)
            }
            // 否则,尝试用地址定位
            else {
                console.log('[after init map] try to locate by address: ', address)
                if (!address || !area) {
                    throw new Error(' [address, area, lng, lat] not exist ')
                }
                const [p, c, t] = area.split('-')
                let point: any = await this.getPointInCity(address || '市政府', c)
                this.pointChange(point.lng, point.lat)
                this.map.centerAndZoom(point, 16);
            }
            // 异常情况获取设备位置定位
        } catch (e) {
            console.log('[after init map] fallback to getPosition; reason ', e.message)
            const res = await getPosition()
            let lng: number = 114.034276, lat: number = 22.663621
            console.log('getPosition---------->', res)
            if (res.success) {
                console.log('[after init map] get position success ', res.data)
                lng = res.data.longitude
                lat = res.data.latitude
            }
            else {
                console.log('[after init map] get position failed locate on 1card1 Inc.')
            }
            // @ts-ignore
            const point = new BMap.Point(lng, lat);  // 创建点坐标
            this.map.centerAndZoom(point, 15);
            this.map.enableScrollWheelZoom(true);
            this.setState({lng, lat})
            this.pointChange(lng + '', lat + '')
        }
    }

    searchPoint = async (e: Event) => {
        // @ts-ignore
        const res = await geocoder(e.target.value);
        if (!res.success) return
        console.log(res.data);
        const {lng, lat} = res.data.location;
        // @ts-ignore
        this.map.panTo(new BMap.Point(lng, lat));
        this.pointChange(lng, lat);
        // @ts-ignore
        e.target.blur();
    }

    // 在城市中搜索关键词
    getPointInCity = (query: string, city: string) => new Promise((resolve, reject) => {
        console.log(query, city)
        // @ts-ignore
        const myGeo = new BMap.Geocoder();
        myGeo.getPoint(query, (point: any) => {
            point ? resolve(point) : reject(new Error(`can't find ${query} in city ${city} `))
        }, city);
    })

    getAddressByGeo = (lng: number, lat: number) => new Promise((resolve, reject) => {
        // @ts-ignore
        var myGeo = new BMap.Geocoder();
        // @ts-ignore
        myGeo.getLocation(new BMap.Point(lng, lat), (result) => {
            if (result) {
                console.log('[getAddressByGeo] ', result)
                const {addressComponents, point, business = '', surroundingPois = []} = result
                const {province, city, district, street = '', streetNumber = ''} = addressComponents
                resolve({
                    pointList: surroundingPois,
                    address: `${street}${streetNumber}${business}`,
                    area: `${province}-${city}-${district}`,
                    lng: point.lng,
                    lat: point.lat,
                })
            }
            else {
                reject(new Error('no result'))
            }
        });
    })

    pointChange = async (lng: string, lat: string) => {
        try {
            const data: any = await this.getAddressByGeo(+lng, +lat)
            this.setState(data)
        } catch (e) {
            this.setState({lng, lat})
        }
    }

    actionCancel = () => {
        this.props.resolve({success: false, message: 'user cancel !'})
        this._action.close()
    }

    confirm = async () => {
        try {
            let {area, address, lng, lat, pointList} = this.state
            const point = pointList.find(it => it.uid === this.state.pickedPoint)
            address = point.address + point.title
            lng = point.point.lng + ''
            lat = point.point.lat + ''
            this.props.resolve({success: true, data: {area, address, lng, lat}})
            this._action.close()
        } catch (e) {
            this.actionCancel()
        }
    }

    pickPoint = (uid: string) => {
        console.log(uid, ' point change')
        this.setState({
            pickedPoint: uid
        })
    }
    clearText = () => {
        this._input.value = ''
    }

    componentDidMount() {
        setTimeout(() => {
            this._action.show();
        }, 20);
    }

    render() {
        return (
            <Action
                className="address-picker-action"
                ref={child => this._action = child}
                onCancel={this.actionCancel}
                position="right"
                stop={true}
            >
                <div className="address-body">
                    <header>
                        <div className="btn-wrap">
                            <button class="btn-cancel" onClick={this.actionCancel}>返回</button>
                            <div className="search">
                                <input type="search" onChange={this.searchPoint} ref={c => this._input = c}/>
                                {/*<span onClick={this.clearText}>&times;</span>*/}
                            </div>
                            <button class="btn-confirm" onClick={this.confirm}>确认</button>
                        </div>
                    </header>

                    <section>
                        <div className="map" ref={c => this._mapDom = c}></div>
                        <div className="picker-wrap">
                            {
                                (this.state.pointList && this.state.pointList.length) ? (
                                    <PointPicker value={this.state.pickedPoint || ''} pointList={this.state.pointList || []} onChange={this.pickPoint}/>
                                ) : (
                                    <p class="point-empty">附近没有地点可选,移动试试吧~</p>
                                )
                            }
                        </div>
                    </section>
                </div>
            </Action>
        )
    }
}

const dftOptions = {}
export default function (options: PickAddressOptions) {
    return new Promise((resolve) => {
        const el = document.createElement('div');
        const actionProps: AddressPickerPops = {...dftOptions, ...options, resolve}
        document.body.appendChild(el);
        render(<AddressPicker {...actionProps} />, document.body, el);
    })
}
