import * as preact from 'preact'
import TimeAction, {TimeActionProps} from "./TimeAction/index";
import * as dayjs from 'dayjs'
import * as API from '../dev/api'

export interface PickTimeOptions {
    start: dayjs.Dayjs,
    end: dayjs.Dayjs,
    value: string,
    toast: Function,
    getTimeSpan?: Function, // 获取时段
    yearCheck?: Function,
    monthCheck?: Function,
    dateCheck?: Function,
    format?: string,
    title?: string,
}

const {h, render, Component} = preact

const dftOptions = {
    title: '配送时间',
    toast: console.log,
    format: 'YYYY/MM/DD'
}

export default function (options: PickTimeOptions) {
    return new Promise((resolve) => {
        const el = document.createElement('div');
        const actionProps: TimeActionProps = {...dftOptions, ...options, resolve}
        document.body.appendChild(el);
        render(<TimeAction {...actionProps} />, document.body, el);
    })
}
