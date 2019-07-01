import * as preact from 'preact'
import "./index.less"
import {TweenManager} from "../utils";
import Scroller from '../utils/BScroller'
// import {lockScroll} from "../utils/dom";

const {h, render, Component} = preact

export interface Item {
    label: string,
    value: any,
    disabled?: boolean
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
    private _scroller: Scroller
    onScroll: boolean

    constructor(props: RowPickerProps) {
        super(props)
    }

    getStyle = (): string => {
        const base = this.base
        return ``
    }

    onTouchMove = (e: Event): void => {
        // e.stopPropagation()
    }

    pickItem = (item: Item) => (e: Event) => {
        if (item.disabled || this.onScroll) return
        this.props.onPickItem(item)
    }

    autoScroll = () => {
        let index = this.props.options.findIndex(it => it.value === this.props.value)
        let items = Array.from(this.base.getElementsByClassName('picker-list')[0].children)
        items[index] && this.scrollToElement(items[index])
    }

    autoPick = () => {
        const pickedItem = this.props.options.find(it => it.value === this.props.value)
        if (!pickedItem) return
        if (pickedItem.disabled) {
            const first = this.props.options.find(it => !it.disabled)
            if (first) {
                this.props.onPickItem(first)
            }
            else {
                this.props.onPickItem({value: '', label: ''})
            }
        }
    }
    scrollToElement = (el: any) => {
        this.onScroll = true
        const scroller = this._scroller.scroller
        if (!scroller) {
            this.onScroll = false
            return
        }
        // @ts-ignore
        scroller.scrollToElement(el, 300, 0, true)
        setTimeout(() => {
            this.onScroll = false
        }, 320)
    }

    scrollTo = async (offset: number) => {
        this.onScroll = true
        const scroller = this._scroller.scroller
        if (!scroller) {
            this.onScroll = false
            return
        }
        // @ts-ignore
        scroller.scrollTo(0, 100, 300)
        console.log(this._scroller.scroller)
        setTimeout(() => {
            this.onScroll = false
        }, 320)
    }

    componentDidMount() {
        this.autoScroll()
        // lockScroll(this.base)
    }

    componentDidUpdate() {
        this.autoScroll()
        this.autoPick()
        this._scroller && this._scroller.refresh(30)
    }

    render() {
        const isPick = (item: Item) => item.value === this.props.value ? ' picked ' : ''
        const enable = (item: Item) => item.disabled ? ' disabled ' : ''
        return (
            <div class={' picker ' + (this.props.className || '')} onTouchMove={this.onTouchMove}>
                <Scroller ref={(c: any) => this._scroller = c}>
                    <ul className="picker-list" style={this.getStyle()}>
                        {
                            this.props.options.map((item: Item, index: number) => (
                                <li class={'picker-item' + isPick(item) + enable(item)} onClick={this.pickItem(item)}>
                                    {
                                        this.props.template ?
                                            this.props.template(item) :
                                            (<span>{item.label}</span>)
                                    }
                                </li>
                            ))
                        }
                    </ul>
                </Scroller>
            </div>
        );
    }
}
