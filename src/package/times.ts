import * as dayjs from 'dayjs'

interface isLarger {
    (a: any, b: any): boolean
}

interface InitialValue {
    year: string,
    month: string,
    date: string,
}

const order = (a: any, b: any, check: isLarger = (a: number, b: number) => a > b): [any, any] => check(a, b) ? [b, a] : [a, b]

interface TimeTreeProps {
    start: dayjs.Dayjs,
    end: dayjs.Dayjs,
    yearCheck?: Function,
    dateCheck?: Function,
    monthCheck?: Function,
    initial: InitialValue
}

const dftOptions: TimeTreeProps = {
    start: dayjs(),
    end: dayjs(),
    yearCheck: (date: dayjs.Dayjs) => false,
    dateCheck: (date: dayjs.Dayjs) => false,
    monthCheck: (date: dayjs.Dayjs) => false,
    initial: {
        year: '',
        month: '',
        date: '',
    }
}

type valueType = 'year' | 'month' | 'date'

interface TimeItem {
    label: string,
    value: number,
    date: dayjs.Dayjs,
    disabled: boolean,
    children?: TimeItem[],
}

export class TimeTree {
    start: dayjs.Dayjs
    end: dayjs.Dayjs
    private yearCheck: Function
    private monthCheck: Function
    private dateCheck: Function
    list: TimeItem[]
    initial: InitialValue
    year: number
    month: number
    date: number

    get yearList()/*: TimeItem[]*/ {
        const result: TimeItem[] = []

        let {start, end} = this
        let [s, e]: [dayjs.Dayjs, dayjs.Dayjs] = order(start, end, (a, b) => a.year() > b.year())

        while (s.isBefore(e.add(1, 'year'))) {
            result.push({
                value: s.year(),
                date: s,
                label: s.year() + '年',
                disabled: this.yearCheck(s)
            })
            s = s.add(1, 'year')
        }

        return result
    }

    get monthList(): TimeItem[] {
        if (!this.year) return []
        return [...Array(12)].fill(1).map((n: any, i: number) => {
            const dateStr = `${this.year}/${i + 1}/01`
            const date = dayjs(dateStr)
            return {
                label: i + 1 + '月',
                value: i + 1,
                date,
                disabled: this.monthCheck(date)
            }
        })
    }

    get dateList(): TimeItem[] {
        if (!this.month) return []
        const monthStr = `${this.year}/${this.month}/01`
        const days: number = dayjs(monthStr).daysInMonth()
        return [...Array(days)].fill(1).map((n: any, i: number) => {
            const date = dayjs(`${this.year}/${this.month}/${i + 1}`)
            return {
                label: date.date() + '日',
                date,
                value: date.date(),
                disabled: this.dateCheck(date)
            }
        })
    }

    constructor(options: TimeTreeProps) {
        Object.assign(this, options)
        this.autoPick()
    }

    autoPick = () => {
        if (this.pick('year', this.yearList)) {
            if (this.pick('month', this.monthList)) {
                this.pick('date', this.dateList)
                console.log('picked ', this.year, this.month, this.date)
            }
        }
    }

    pick = (prop: valueType, list: TimeItem[]) => {
        console.log('pick ', prop)
        const value = this.initial[prop]
        // 检查initial的值能否存在且可选择,不能,则自动选择第一个可选值
        if (value) {
            const item = list.find(it => it.value === +value)
            if (item && !item.disabled) {
                this[prop] = +value
                return true
            }
        }
        const first = list.find(it => !it.disabled)
        if (!first) return false
        this[prop] = +first.value
        return true
    }
}

export default function TimeGenerator(options: TimeTreeProps): TimeTree {
    if (typeof options.yearCheck !== 'function') delete options.yearCheck
    if (typeof options.dateCheck !== 'function') delete options.dateCheck
    if (typeof options.monthCheck !== 'function') delete options.monthCheck
    return new TimeTree({...dftOptions, ...options})
}
