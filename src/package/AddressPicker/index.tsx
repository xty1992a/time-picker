import * as preact from 'preact'
import Action from '../Action/index'
import './index.less'
import {AddressAction} from "../AdressAction";

const {Component, h, render} = preact

interface AddressPickerPops {
    resolve: Function
}

interface PickAddressOptions {

}

export class AddressPicker extends Component<AddressPickerPops, any> {
    private _action: Action

    actionCancel = () => {
        this.props.resolve({success: false, message: 'user cancel !'})
    }

    componentDidMount() {
        setTimeout(() => {
            this._action.show();
        }, 20);
    }

    render() {
        return (
            <Action
                className="address-picker-action"
                ref={child => this._action = child}
                onCancel={this.actionCancel}
                position="right"
                stop={true}
            >
                <div className="address-body">

                </div>
            </Action>
        )
    }
}

const dftOptions = {}
export default function (options: PickAddressOptions) {
    return new Promise((resolve) => {
        const el = document.createElement('div');
        const actionProps: AddressPickerPops = {...dftOptions, ...options, resolve}
        document.body.appendChild(el);
        render(<AddressPicker {...actionProps} />, document.body, el);
    })
}
