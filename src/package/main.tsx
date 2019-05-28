import * as preact from 'preact'
import TimeAction, {TimeActionProps} from "./TimeAction/index";
import * as dayjs from 'dayjs'

export interface PickTimeOptions {
    start: dayjs.Dayjs,
    end: dayjs.Dayjs,
    value: dayjs.ConfigType,
    getTimeSpan?: Function, // 获取时段
    yearCheck?: Function,
    monthCheck?: Function,
    dateCheck?: Function,
    title?: string,
}

const {h, render, Component} = preact

const dftOptions = {
    title: '配送时间'
}

export default function (options: PickTimeOptions) {
    return new Promise((resolve) => {
        const el = document.createElement('div');
        const actionProps: TimeActionProps = {...dftOptions, ...options, resolve}
        document.body.appendChild(el);
        render(<TimeAction {...actionProps} />, document.body, el);
    })
}
