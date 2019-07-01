import preact, {Component} from 'preact';
import BScroll from 'better-scroll';

export default class Scroller extends Component {
  constructor(props) {
	super(props);
	this.state = {
	  offsetY: 0,
	}
  }

  refresh(delay = 20) {
	setTimeout(() => {
	  this.scroller && this.scroller.refresh()
	}, delay)
  }

  componentDidMount() {
	setTimeout(() => {
	  this.scroller = new BScroll(this.base, {
		tap: true,
		click: true,
		mouseWheel: true,
	  })

	  this.scroller.on('scrollEnd', ({y}) => {
		let {abs} = Math;
		if (abs(this.scroller.maxScrollY) - (this.props.min || 10) < abs(y)) {
		  this.props.onReachBottom && this.props.onReachBottom(y)
		}
	  })
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
