import * as preact from 'preact'
import * as dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import './index.less'
import {SvgIcon} from './icon/index'

dayjs.locale('zh-cn')
const {Component, h, render} = preact

interface ShippingProps {
    data: Options,
    uniq: boolean
}

const filters = {
    fmt: (v: dayjs.ConfigType) => dayjs(v).format('YYYY-MM-DD HH:mm'),
    date: (v: dayjs.ConfigType) => dayjs(v).format('YYYY-MM-DD'),
    week: (v: dayjs.ConfigType) => dayjs(v).format('周dd'),
    time: (v: dayjs.ConfigType) => dayjs(v).format('HH:mm:ss'),
    icon: (s: number) => {
        const map = [
            '',
            'shipping_tel',
            'shipping_order',
            'shipping_car',
            'shipping_canceled',
            'shipping_runboy',
            'shipping_complete',
            'shipping_runboy',
        ]
        return map[s] || 'shipping_order'
    }
}

const uniqFn = (processList: Process[]) => processList.reduce((result, item) => {
    if (result.map(it => it.status).includes(item.status)) {
        return result
    }
    return [...result, item]
}, [])

const fmtProcess = (processList: Process[], uniq: boolean) => (uniq ? uniqFn(processList) : processList).reverse()

class ShippingBlock extends Component<ShippingProps, any> {
    constructor(props: ShippingProps) {
        super(props);
    }


    render() {
        const {addressInfo: address, orderInfo: order, processList} = this.props.data
        const process = fmtProcess(processList, this.props.uniq)
        return (
            <div class="shipping-detail">
                <section class="order-block layout-block">
                    <div className="panel">
                        <span className="label">商品数量: </span>
                        <span className="value">{order.goodsNumber}件 {
                            order.runboyBusiness && `由${order.runboyBusiness}承运`
                        }</span>
                    </div>
                    <div className="panel">
                        <span className="label">配送状态: </span>
                        <span className="value">{order.currentStatusDisplay}</span>
                    </div>
                    <div className="panel">
                        <span className="label">运单编号: </span>
                        <span className="value"><b>{order.runboyNo}</b></span>
                    </div>
                    <div className="panel">
                        <span className="label">配送员电话: </span>
                        <span className="value"><b>{order.runboyNumber}</b></span>
                    </div>
                </section>

                <section class="layout-block process-block">
                    {
                        process.map((item: Process) => (
                                <div class="process-item" key={item.time}>
                                    <div class="time">
                                        <b className="date">{filters.date(item.time)}/</b>
                                        <span className="week">{filters.week(item.time)}</span>
                                        <b class="clock">{filters.time(item.time)}</b>
                                    </div>
                                    <div class="icon">
                                        <div class="icon-wrap">
                                            <SvgIcon icon={filters.icon(item.status)}/>
                                        </div>
                                    </div>
                                    <div class="status">
                                        <p class="status-text">{item.statusDisplay}</p>
                                        {
                                            item.comments && (<p class="status-memo">{item.comments}</p>)
                                        }
                                    </div>
                                </div>
                            )
                        )
                    }
                </section>
            </div>
        )
    }
}

interface Address {
    name: string
    number: string
    address: string
    deadline: string
}

interface Order {
    currentStatus: number,
    currentStatusDisplay: string,
    runboyNumber: string,
    runboyBusiness: string,
    goodsNumber: number,
    runboyNo: string,
}

interface Process {
    time: string,
    status: number,
    statusDisplay: string,
    comments: string,
}

interface Options {
    addressInfo: Address,
    orderInfo: Order,
    processList: Process[]
}

export default function (el: HTMLElement, data: Options, uniq: boolean = false) {
    render(<ShippingBlock data={data} uniq={uniq}/>, el)
}
