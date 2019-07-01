import * as preact from 'preact'
import Action from '../Action/index'
import './index.less'
import pickAddress from '../AddressPicker'

import * as Utils from '../utils/getPosition'

const { Component, h, render } = preact

const tel_validator = (str: string): boolean => /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(str)

interface Item {
    id: string,
    name: string,
    children?: Item[]
}

interface AddressActionProps {
    resolve: Function,
    toast: Function,
    name?: string,
    area?: string,
    address?: string,
    mobile?: string,
    lng?: string,
    lat?: string,
}

interface addAddressOptions {
    toast: Function,
    name?: string,
    address?: string,
    area?: string,
    mobile?: string,
    lng?: string,
    lat?: string,
}

type FormItem = 'name' | 'mobile' | 'address' | 'lng' | 'lat' | 'area'

export class AddressAction extends Component<AddressActionProps, any> {
    private _action: Action

    state: {
        lng: string
        lat: string
        name: string
        address: string
        mobile: string
        area: string
    }

    constructor(props: AddressActionProps) {
        super(props)

        this.setState({
            lng: props.lng || '',
            lat: props.lat || '',
            name: props.name || '',
            area: props.area || '',
            address: props.address || '',
            mobile: props.mobile || '',
        })
    }

    setFormItem(prop: FormItem, el: EventTarget) {
        this.setState({
            // @ts-ignore
            [prop]: el.value
        })
    }

    confirm = (data: any) => {
        this.props.resolve({
            success: true,
            data
        })
        this._action.close()
    }
    submit = (e: Event) => {
        e.preventDefault()
        const data = this.state
        if (!Object.keys(data).every((key: FormItem) => Boolean(data[key]))) {
            if (!data.lat || data.lng) {
                this.props.toast('请点击[选择地区]添加位置')
            }
            else {
                this.props.toast('请填写完整!')
            }
            console.log('not fullfilled')
            return
        }
        if (!tel_validator(data.mobile)) {
            this.props.toast('请正确填写手机号码!')
            return
        }
        console.log(data)
        this.confirm(data)
    }

    /*    regionChange = (payload: Region) => {
            const {provinceID, cityID, countryID} = payload
            console.log('region change ', payload)
            this.setState({provinceID, cityID, countryID})
        }*/
    actionCancel = () => {
        this.props.resolve({ success: false, message: 'user cancel !' })
    }

    pickMapPoint = async () => {
        const { lng, lat, address, area } = this.state
        const result: any = await pickAddress({ lng, lat, address, area })
        if (result.success) {
            const { address, area, lng, lat } = result.data
            this.setState({ address, area, lng, lat })
        }
        console.log(result)
    }

    componentDidMount() {
        setTimeout(() => {
            this._action.show();
        }, 20);
        // this.pickMapPoint()
    }

    render() {
        return (
            <Action
                className="address-action"
                ref={child => this._action = child}
                onCancel={this.actionCancel}
                position="bottom"
                stop={true}
            >
                <form className="address-body" onSubmit={this.submit}>
                    <header>收货地址</header>
                    <section>
                        <div className="address-item">
                            <span class="label">收货人</span>
                            <input name="name"
                                type="text"
                                value={this.state.name}
                                onChange={e => this.setFormItem('name', e.target)} />
                        </div>
                        <div className="address-item">
                            <span class="label">联系电话</span>
                            <input name="mobile"
                                type="text"
                                maxLength={11}
                                value={this.state.mobile}
                                onChange={e => this.setFormItem('mobile', e.target)} />
                        </div>
                        <div className="address-item" onClick={this.pickMapPoint}>
                            <span class="label">选择地区</span>
                            <span className="area">{this.state.area}</span>
                            <input type="hidden" value={this.state.area} name="area" />
                            <input type="hidden" value={this.state.lng} name="lng" />
                            <input type="hidden" value={this.state.lat} name="lat" />
                        </div>
                        <div className="address-item">
                            <span class="label">详细地址</span>
                            <input name="address"
                                type="text"
                                value={this.state.address}
                                onChange={e => this.setFormItem('address', e.target)} />
                        </div>
                    </section>
                    <footer>
                        <input type="submit" role="button" onClick={this.submit}>确定</input>
                    </footer>
                </form>
            </Action>
        )
    }
}

const dftOptions = {
    toast: console.log
}

function addAddress(options: addAddressOptions) {
    return new Promise((resolve) => {
        const el = document.createElement('div');
        const actionProps: AddressActionProps = { ...dftOptions, ...options, resolve }
        document.body.appendChild(el);
        render(<AddressAction {...actionProps} />, document.body, el);
    })
}

addAddress.utils = Utils

export default addAddress
