import * as preact from 'preact'
import Picker, {Item} from '../Picker/index'
import './index.less'

const {Component} = preact

interface PointPickerProps {
    pointList: any[],
    value: any,
    onChange: Function
}

function PointTemplate(item: any): preact.ComponentChild {
    return (
        <div class="point-item">
            <p className="title">{item.data.title}</p>
            <p className="address-str">{item.data.address || '暂无...'}</p>
            <i className="iconfont icon-icon_xuanzhong1"></i>
        </div>
    )
}

export default class PointPicker extends Component<PointPickerProps, any> {

    state: {
        options: Item[]
    }

    constructor(props: PointPickerProps) {
        super(props)
    }

    point2Options = (points: any[]) => {
        return points.map(it => ({
            value: it.uid,
            data: it,
            label: it.title,
        }))
    }

    pickItem = (item: any) => {
        console.log(item)
        this.props.onChange(item.value)
    }

    componentDidUpdate() {
        console.log(this.props, ' component update ')
    }

    render() {
        return (
            <Picker
                className="point-picker"
                options={this.point2Options(this.props.pointList)}
                template={PointTemplate}
                value={this.props.value}
                onPickItem={this.pickItem}
            />
        )
    }
}
