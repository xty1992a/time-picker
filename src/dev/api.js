const fmtRegion = (data, id = '0') => {
  if (typeof data === 'string') {
	return {
	  id, name: data,
	}
  }
  const item = {
	children: [],
	name: data.n || '中国',
	id,
  }
  Object.keys(data).forEach((key) => {
	if (key === 'n') return
	const value = data[key]
	item.children.push(fmtRegion(value, key))
  })
  return item
}
const AK = 'AYaM1mMV2BSChZjk9MuPFgCw'
const AMAP_KEY = 'dc647dd43e7efdf80a3e603e0933aebd'
import request from './request'

export const getRegion = () => import('./region').then(res => ({success: true, data: fmtRegion(res.region)}))

export const getPoints = ({lng, lat}) => request(`https://restapi.amap.com/v3/place/around?key=${AMAP_KEY}&location=${lng},${lat}`, null, 'GET')

export const address2geo = address => request(`http://api.map.baidu.com/geocoder/v2/?address=${address}&output=json&ak=${AK}`, null, 'GET')
