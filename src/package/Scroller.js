import preact, { Component } from 'preact';
import AlloyTouch from 'alloytouch/alloy_touch.css';
import Transform from 'css3Transform';
export default class Scroller extends Component {
	constructor(props) {
		super(props);
		this.state = {
			offsetY: 0,
		}
	}

	getStyle() {
		return `transform: translate3d(0,${this.state.offsetY}px, 0);min-height:100%;`
	}

	refresh = (delay = 20) =>{
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
			Transform(target,true);
			const options = {
				touch: wrap,
				target,
				initialValue: 0,
				property: 'translateY',
				min,
				max: 0,
				change: value => {
					// this.setState({
					// 	offsetY: value,
					// });
					// this.props.scroll && this.props.scroll(value)
				},
				animationEnd: value => {
					this.props.scrollEnd && this.props.scrollEnd(value);
					let {abs} = Math;
					if (abs(this.alloyTouch.min) - (this.props.min || 10) < abs(value)) {
						this.props.onReachBottom && this.props.onReachBottom(value)
					}
				},
				touchEnd: (event, value) => {
					
				}
			}
			// console.log(options.min, options.max, wrap.clientHeight, slide, slide.clientHeight)
			this.alloyTouch = new AlloyTouch(options)
		}, this.props.delay || 20)
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.refresh()
	}

	render(props, state, context) {
		return (<div className="scroller" style="height: 100%;">
			<div className="scroll-slider">
				{this.props.children}
			</div>
		</div>)
	}

}