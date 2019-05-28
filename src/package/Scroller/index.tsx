import * as preact from 'preact';
import AlloyTouch from 'alloytouch/alloy_touch.css';
import Transform from 'css3Transform';

const {Component} = preact;

interface ScrollerProps {
    scrollEnd: Function,
    onReachBottom: Function,
    delay: number,
    min: number
}

export default class Scroller extends Component<ScrollerProps> {
    state = {}
    alloyTouch: any = null;

    constructor(props: ScrollerProps) {
        super(props);
        this.state = {
            offsetY: 0,
        }
    }

    refresh = (delay = 20) => {
        if (!this.alloyTouch) return
        setTimeout(() => {
            let wrap = this.base;
            let target = this.base.children[0];
            this.alloyTouch.min = wrap.clientHeight - target.clientHeight;
        }, delay)
    }

    componentDidMount() {
        setTimeout(() => {
            let wrap = this.base;
            let target = this.base.children[0];
            let min = wrap.clientHeight - target.clientHeight;
            if (min > 0) {
                min = -1
            }
            Transform(target, false);
            const options = {
                touch: wrap,
                target,
                initialValue: 0,
                property: 'translateY',
                min,
                max: 0,
                change: (value: number) => {
                    // this.setState({
                    // 	offsetY: value,
                    // });
                    // this.props.scroll && this.props.scroll(value)
                },
                animationEnd: (value: number) => {
                    this.props.scrollEnd && this.props.scrollEnd(value);
                    let {abs} = Math;
                    if (abs(this.alloyTouch.min) - (this.props.min || 10) < abs(value)) {
                        this.props.onReachBottom && this.props.onReachBottom(value)
                    }
                },
            }
            // console.log(options.min, options.max, wrap.clientHeight, slide, slide.clientHeight)
            this.alloyTouch = new AlloyTouch(options)
        }, this.props.delay || 20)
    }

    componentWillReceiveProps() {
        this.refresh()
    }

    render() {
        return (<div className="scroller" style="height: 100%;">
            <div className="scroll-slider">
                {this.props.children}
            </div>
        </div>)
    }
}
