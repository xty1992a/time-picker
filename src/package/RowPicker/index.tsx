import * as preact from 'preact'
import "./index.less"
import {TweenManager} from '../utils/index'
import * as dayjs from "dayjs";

const SCREEN_WIDTH = document.documentElement.clientWidth

const {h, render, Component} = preact

export interface Item {
    label: string,
    value: any,
    disabled?: boolean,
    date?: dayjs.Dayjs
}

interface RowPickerProps {
    options: Item[],
    value: any,
    onPickItem: (item: Item) => void,
    className?: string,
    isSame?: (a: any, b: any) => boolean
    template?: (item: Item) => preact.ComponentChild
}


export default class RowPicker extends Component<RowPickerProps, any> {
    constructor(props: RowPickerProps) {
        super(props)
    }

    onTouchMove = (e: Event): void => {
        e.stopPropagation()
    }

    pickItem = (item: Item) => (e: Event) => {
        if (item.disabled) return
        this.props.onPickItem(item)
    }

    autoScroll = () => {
        let index = this.props.options.findIndex(it => it.value === this.props.value)
        let items = Array.from(this.base.children[0].children)
        items[index] && this.scrollToElement(items[index])
    }

    autoPick = () => {
        const pickedItem = this.props.options.find(it => it.value === this.props.value)
        if (!pickedItem) return
        if (pickedItem.disabled) {
            const first = this.props.options.find(it => !it.disabled)
            first && this.props.onPickItem(first)
        }
    }

    scrollToElement = (el: any) => {
        // @types-ignore
        let offset = el.offsetLeft - SCREEN_WIDTH / 2 + el.clientWidth / 2
        // console.log('should scroll to ', el, el.offsetLeft, offset)
        this.scrollTo(offset)
    }

    scrollTo = async (offset: number) => {
        const manager = new TweenManager({
            start: this.base.scrollLeft,
            end: offset,
            duration: 100
        })
        while (manager.next()) {
            await TweenManager.frame()
            this.base.scrollLeft = manager.currentValue
        }
    }

    componentDidMount() {
        this.autoScroll()
    }

    componentDidUpdate() {
        this.autoScroll()
        this.autoPick()
    }

    render() {
        const isPick = (item: Item) => item.value === this.props.value ? ' picked ' : ''
        const enable = (item: Item) => item.disabled ? ' disabled ' : ''
        return (
            <div class={' row-picker ' + (this.props.className || '')} onTouchMove={this.onTouchMove}>
                <ul className="row-list">
                    {
                        this.props.options.map((item: Item, index: number) => (
                            <li class={'row-item' + isPick(item) + enable(item)} onClick={this.pickItem(item)}>
                                {
                                    this.props.template ?
                                        this.props.template(item) :
                                        (<span>{item.label}</span>)
                                }
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}
