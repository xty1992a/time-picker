import * as preact from 'preact'
import TimeAction, {TimeActionProps} from "./TimeAction/index";
import * as dayjs from 'dayjs'
import {getPosition, Result} from './utils/getPosition'

console.log('getPosition')
getPosition()
    .then((res: Result) => {
        console.log('get position ', res)
        if (res.success) {
            const div = document.createElement('div')
            div.innerText = `
            您的位置: 经度: ${res.data.latitude}, 纬度: ${res.data.longitude}
            `
            document.body.appendChild(div)

        }
    })

export interface PickTimeOptions {
    start: dayjs.Dayjs,
    end: dayjs.Dayjs,
    value: string,
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
