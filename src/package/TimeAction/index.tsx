import * as preact from 'preact'
import Action from '../Action/index'
import RowPicker, {Item} from '../RowPicker/index'
import Picker from '../Picker/index'
import './time-action.less'
import TimeGenerator, {TimeTree} from '../times'
import * as dayjs from "dayjs";

const {Component} = preact

const weekLabel = ['日', '一', '二', '三', '四', '五', '六']
const fmtWeek = (date: dayjs.Dayjs) => '周' + weekLabel[date.day()]

interface valueObject {
    year: string,
    month: string,
    date: string,
    span?: string,
}

// value: 2020/01/01 09:00-18:00
function fmtValue(value: string): valueObject {
    const result = {
        year: '',
        month: '',
        date: '',
        span: ''
    }
    if (!value) return result
    const dateStr = value.split(' ')[0]
    const span = value.split(' ')[1] || ''
    const date = dayjs(dateStr)
    result.year = date.year() + ''
    result.month = date.month() + 1 + ''
    result.date = date.date() + ''
    result.span = span
    return result
}

export interface TimeActionProps {
    start: dayjs.Dayjs,
    end: dayjs.Dayjs,
    value: string,
    toast: Function,
    getTimeSpan?: Function,
    yearCheck?: Function,
    monthCheck?: Function,
    dateCheck?: Function,
    resolve: Function,
    format: string,
    title?: string,
}

// region 各子选项模板
function yearTemplate(item: Item): preact.ComponentChild {
    return (
        <div class="year-item">{item.label}</div>
    )
}

function monthTemplate(item: Item): preact.ComponentChild {
    return (
        <div className="month-item">{item.label}</div>
    )
}

function dateTemplate(item: Item): preact.ComponentChild {
    return (
        <div className="date-item">{item.date.format('M月D日') + `[${fmtWeek(item.date)}]`}</div>
    )
}

function spanTemplate(item: Item): preact.ComponentChild {
    return (
        <div className="span-item">
            <div className="span-box">{item.label}</div>
        </div>
    )
}

// endregion

export default class Index extends Component<TimeActionProps, any> {
    private _action: Action;

    state: {
        times: TimeTree,
        year: number,
        month: number,
        date: number,
        span: string,
        spanList: Item[]
    }

    constructor(props: TimeActionProps) {
        super(props)
        const {start, end, yearCheck, monthCheck, dateCheck, value} = props
        console.log('out value', value, fmtValue(value))
        const initial = fmtValue(value)
        const span = initial.span

        const times = TimeGenerator({start, end, yearCheck, monthCheck, dateCheck, initial})
        this.setState({
            times,
            year: times.year,
            month: times.month,
            date: times.date,
            spanList: [],
            span
        })
        this.createSpan()
        console.log('time tree ', times)
    }

    pickItem = (value: object) => {
        this.props.resolve({success: true, data: value});
        this.close();
    }

    confirm = () => {
        const {year, month, date, span, spanList} = this.state
        let dateStr = dayjs(`${year}/${month}/${date}`).format(this.props.format)
        if (spanList.length) {
            if (!span) {
                this.props.toast('请选择时段!')
                return
            }
            dateStr += ` ${span}`
        }
        this.props.resolve({success: true, data: dateStr});
        this.close();
    }

    close = () => {
        this._action.close();
    }

    actionCancel = () => {
        this.props.resolve({success: false, message: 'user cancel !'})
    }

    onReachBottom = (value: number) => {
    }

    pickYear = (item: Item) => {
        this.state.times.year = item.value
        this.setState({
            year: item.value,
        })
        // 2020/02/29 切换到 2021年也需要触发每月最后一天检查
        this.pickMonth(this.state.times.monthList.find(it => it.value === this.state.month))
        // this.createSpan()
    }
    pickMonth = (item: Item) => {
        let {times, date} = this.state
        times.month = item.value
        const lastDate = times.dateList.slice(-1)[0]
        // 当前所选日期大于可选最大值
        if (lastDate && (date > lastDate.value)) {
            date = lastDate.value
            // this.pickDate(lastDate)
        }
        this.setState({
            month: item.value,
            date
        })
        this.createSpan()
    }
    pickDate = (item: Item) => {
        this.setState({date: item.value})
        this.createSpan()
    }
    pickSpan = (item: Item) => {
        this.setState({
            span: item.value,
        })
    }

    createSpan = () => {
        const {year, month, date, span} = this.state
        console.log(year, month, date, span)
        if (this.props.getTimeSpan) {
            this.setState({
                spanList: this.props.getTimeSpan({...this.state})
            })
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this._action.show();
        }, 20);
    }

    componentWillUnmount() {
    }

    render(props: TimeActionProps) {
        return (
            <Action
                className="time-action"
                ref={child => this._action = child}
                onCancel={this.actionCancel}
                position="bottom"
                stop={true}
            >
                <div className={`time-body`}>
                    <header>
                        <p>{props.title}</p>
                    </header>
                    <section>
                        <RowPicker
                            className="year-picker"
                            options={this.state.times.yearList}
                            value={this.state.year}
                            onPickItem={this.pickYear}
                            template={yearTemplate}/>
                        <RowPicker
                            className="month-picker"
                            options={this.state.times.monthList}
                            value={this.state.month}
                            onPickItem={this.pickMonth}
                            template={monthTemplate}/>
                        <div className="picker-wrap">
                            <Picker
                                className="date-picker"
                                options={this.state.times.dateList}
                                value={this.state.date}
                                onPickItem={this.pickDate}
                                template={dateTemplate}
                            />
                            {
                                this.state.spanList.length ?
                                    (
                                        <Picker
                                            className="span-picker"
                                            options={this.state.spanList}
                                            value={this.state.span}
                                            onPickItem={this.pickSpan}
                                            template={spanTemplate}
                                        />
                                    ) :
                                    (null)
                            }
                        </div>
                    </section>
                    <footer>
                        <button onClick={this.confirm}>确认</button>
                    </footer>
                </div>
            </Action>
        )
    }
}
