import * as preact from 'preact'
import Action from '../Action/index'
import './index.less'
import pickAddress from '../AddressPicker'

const {Component, h, render} = preact

interface Item {
    id: string,
    name: string,
    children?: Item[]
}

interface AddressActionProps {
    resolve: Function,
    name?: string,
    address?: string,
    number?: string,
    provinceID?: string,
    cityID?: string,
    countryID?: string,
    lng?: string,
    lat?: string,
    region: Item
}

interface addAddressOptions {
    name?: string,
    address?: string,
    number?: string,
    provinceID?: string,
    cityID?: string,
    countryID?: string,
    lng?: string,
    lat?: string,
    region: Item
}

interface SelectProps {
    value: string,
    options: Item[],
    onSelect: Function,
    name: string
}

class Selector extends Component<SelectProps, any> {
    constructor(props: SelectProps) {
        super(props)
    }

    pickItem = () => {
        // @ts-ignore
        this.props.onSelect(this.base.value)
    }

    componentDidUpdate() {
        if (!this.props.options.map(it => it.id).includes(this.props.value)) {
            this.props.onSelect(this.props.options[0].id)
        }
    }

    render() {
        return (
            <select name={this.props.name} value={this.props.value} onChange={this.pickItem}>
                {
                    this.props.options.map(it => (
                        <option value={it.id} key={it.id}>{it.name}</option>
                    ))
                }
            </select>
        )
    }
}

interface RegionPickerProps extends Region {
    region: Item,
    onChange: Function,
}

type PickType = 'cityID' | 'provinceID' | 'countryID'

interface Region {
    cityID: string,
    provinceID: string,
    countryID: string,
}

export class RegionPicker extends Component<RegionPickerProps, any> {
    state: {
        cityID: string,
        provinceID: string,
        countryID: string,

        cities: Item[],
        provinces: Item[],
        countries: Item[],
    }

    constructor(props: RegionPickerProps) {
        super(props)
        let {cityID, provinceID, countryID, region} = props
        let provinces: Item[] = region.children
        let pItem: Item = provinces.find(it => it.id === provinceID) || provinces[0]
        let cities: Item[] = pItem.children
        let cItem: Item = cities.find(it => it.id === cityID) || cities[0]
        let countries: Item[] = cItem.children
        let tItem = countries.find(it => it.id === countryID) || countries[0]
        console.log(pItem.id, cItem.id, tItem.id)
        this.setState({
            cities, provinces, countries,
            provinceID: pItem.id,
            cityID: cItem.id,
            countryID: tItem.id,
        })
    }

    pickItem = (prop: PickType) => {
        return (value: string) => {
            const state: {
                [prop: string]: Item[] | string
            } = {
                [prop]: value,
            }
            if (prop === 'provinceID') {
                state.cities = this.state.provinces.find(it => it.id === value).children
            }
            if (prop === 'cityID') {
                state.countries = this.state.cities.find(it => it.id === value).children
            }
            if (prop === 'countryID') {
                this.props.onChange({})
            }
            this.setState(state)
        }
    }

    render() {
        return (
            <div className="region-picker">
                <Selector options={this.state.provinces}
                          name="provinceID"
                          value={this.state.provinceID}
                          onSelect={this.pickItem('provinceID')}/>
                <Selector options={this.state.cities}
                          name="cityID"
                          value={this.state.cityID}
                          onSelect={this.pickItem('cityID')}/>
                <Selector options={this.state.countries}
                          name="countryID"
                          value={this.state.countryID}
                          onSelect={this.pickItem('countryID')}/>
            </div>
        )
    }
}

export class AddressAction extends Component<AddressActionProps, any> {
    private _action: Action
    name: string
    address: string
    number: string
    provinceID: string
    cityID: string
    countryID: string
    lng: string
    lat: string

    constructor(props: AddressActionProps) {
        super(props)
        this.setState({
            name: props.name,
            address: props.address,
            number: props.number,
            provinceID: props.provinceID,
            cityID: props.cityID,
            countryID: props.countryID,
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
        // @ts-ignore
        const form = new FormData(this.base.getElementsByTagName('form')[0])
        const data: {
            [prop: string]: string
        } = {}

        form.forEach((val: string, key: string) => {
            data[key] = val
            this.setState({
                [key]: val
            })
        })

        this.confirm(data)
    }

    regionChange = (payload: Region) => {
        const {provinceID, cityID, countryID} = payload
        this.setState({provinceID, cityID, countryID})
    }
    actionCancel = () => {
        this.props.resolve({success: false, message: 'user cancel !'})
    }
    pickMapPoint = async () => {
        const result = await pickAddress({})
        console.log(result)
    }

    componentDidMount() {
        setTimeout(() => {
            this._action.show();
        }, 20);
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
                            <input name="name" type="text" value={this.state.name}/>
                        </div>
                        <div className="address-item">
                            <span class="label">联系电话</span>
                            <input name="number" type="text" value={this.state.number}/>
                        </div>
                        <div className="address-item">
                            <span class="label">选择地区</span>
                            {/*<input type="text"/>*/}
                            <RegionPicker region={this.props.region}
                                          provinceID={this.state.provinceID}
                                          cityID={this.state.cityID}
                                          countryID={this.state.countryID}
                                          onChange={this.regionChange}
                            />
                            <span onClick={this.pickMapPoint}>选点</span>
                        </div>
                        <div className="address-item">
                            <span class="label">详细地址</span>
                            <input name="address" type="text" value={this.state.address}/>
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

const dftOptions = {}
export default function (options: addAddressOptions) {
    return new Promise((resolve) => {
        const el = document.createElement('div');
        const actionProps: AddressActionProps = {...dftOptions, ...options, resolve}
        document.body.appendChild(el);
        render(<AddressAction {...actionProps} />, document.body, el);
    })
}

