import * as preact from 'preact'
import Action from '../Action/index'
import Scroller from '../Scroller/index'
import RowPicker, {Item} from '../RowPicker/index'
import Picker from '../Picker/index'
import './time-action.less'
import TimeGenerator, {TimeTree} from '../times'
import * as dayjs from "dayjs";
import times from "../times";

const {Component} = preact

export interface TimeActionProps {
    start: dayjs.Dayjs,
    end: dayjs.Dayjs,
    value: dayjs.ConfigType,
    getTimeSpan?: Function,
    yearCheck?: Function,
    monthCheck?: Function,
    dateCheck?: Function,
    resolve: Function,
    title?: string,
}

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
        <div className="date-item">{item.label}</div>
    )
}

function spanTemplate(item: Item): preact.ComponentChild {
    return (
        <div className="span-item">
            <div className="span-box">{item.label}</div>
        </div>
    )
}

export default class Index extends Component<TimeActionProps, any> {
    private _action: any;

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
        const {start, end, yearCheck, monthCheck, dateCheck} = props
        const times = TimeGenerator({start, end, yearCheck, monthCheck, dateCheck})
        this.setState({
            times,
            year: times.year,
            month: times.month,
            date: times.date
        })
        this.createSpan()
        console.log('time tree ', times)
    }

    pickItem = (value: object) => {
        this.props.resolve({success: true, data: value});
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
        this.createSpan()
    }
    pickMonth = (item: Item) => {
        let {times, date} = this.state
        times.month = item.value
        const lastDate = times.dateList.slice(-1)[0]
        // 当前所选日期大于可选最大值
        if (lastDate && (date > lastDate.value)) {
            // date = lastDate.value
            this.pickDate(lastDate)
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
                </div>
            </Action>
        )
    }
}
