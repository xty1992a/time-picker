// @ts-ignore
const requireAll = requireContext => requireContext.keys().map(requireContext)
// @ts-ignore
const req = require.context('./svg', false, /\.svg$/)
// 引入svg
export const iconMap = requireAll(req)

import './index.less'
import * as preact from 'preact'

const {h} = preact;

interface SvgProps {
    icon: string
    className?: string
}

export const SvgIcon: preact.ComponentFactory<SvgProps> = props => (
    <svg class={props.className + ' svg-icon '} aria-hidden="true">
        <use xlinkHref={'#icon-' + props.icon}></use>
    </svg>
)
