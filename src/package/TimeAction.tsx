import * as preact from 'preact'
import Action from './Action/index'
// import Scroller from './Scroller'
import './time-action.less'

const {h, render, Component} = preact
const storage = {
    getItem(key: string): (object | string) {
        try {
            return JSON.parse(sessionStorage.getItem(key))
        } catch (e) {
            return sessionStorage.getItem(key)
        }
    },
    setItem(key: string, data: any) {
        try {
            sessionStorage.setItem(key, JSON.stringify(data))
        } catch (e) {
            sessionStorage.setItem(key, data.toString())
        }
    },
}

export interface TimeActionProps {
    resolve: Function
    title?: string,
}

export interface PickTimeOptions {
    resolve: Function,
    title: string,
}

const dftOptions: PickTimeOptions = {
    resolve: Promise.resolve,
    title: '配送时间'
}

export class TimeAction extends Component<TimeActionProps, any> {
    private _action: any;

    state = {}

    constructor(props: TimeActionProps) {
        super(props)
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
                    </section>
                </div>
            </Action>
        )
    }
}

export default function (options: PickTimeOptions) {
    options = {...dftOptions, ...options}
    return new Promise((resolve) => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        options.resolve = resolve;
        render(<TimeAction {...options} />, document.body, el);
    })
}
