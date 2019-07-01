// 未编译API,需要引入polyfill
import 'core-js'
import pickTime from './package/main'
import addAddress from './package/AdressAction'
import * as dayjs from 'dayjs';
import * as API from './dev/api'
import * as GPS_convert from './package/utils/GPS_convert'
import showShipping from './package/ShippingBlock'

// const shippingData = {
//   'addressInfo': {
// 	'name': '王鑫炜',
// 	'number': '18867313650',
// 	'address': '创业路与弓村三巷交叉口东南150米龙华新城商业中心',
// 	'deadline': '2019/06/12 10:00-11:00',
//   },
//   'orderInfo': {
// 	'currentStatus': 3,
// 	'currentStatusDisplay': '配送员已取货',
// 	'runboyNumber': '18867313650',
// 	'runboyBusiness': '达达',
// 	'goodsNumber': 1,
// 	'runboyNo': 'DG20190612000001',
//   },
//   'processList': [
// 	{
// 	  'time': '2019-06-12 10:39:37.775',
// 	  'status': 1,
// 	  'statusDisplay': '正在呼叫配送员',
// 	  'comments': '',
// 	},
// 	{
// 	  'time': '2019-06-12 10:49:37.775',
// 	  'status': 3,
// 	  'statusDisplay': '配送员已取货',
// 	  'comments': '需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起',
// 	},
// 	{
// 	  'time': '2019-06-12 10:59:37.775',
// 	  'status': 3,
// 	  'statusDisplay': '配送员已取货',
// 	  'comments': '需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起需自行去达达平台重新发起',
// 	},
// 	{
// 	  'time': '2019-06-12 11:19:37.775',
// 	  'status': 6,
// 	  'statusDisplay': '已送达',
// 	  'comments': '',
// 	},
//   ],
// }

// showShipping(document.getElementById('shipping'), shippingData, true)

// const {getPosition} = addAddress.utils
const sleep = time => new Promise(resolve => setTimeout(resolve, time));
const fmt = d => d.format('YYYY-MM-DD HH:mm:ss');
import * as dom from './package/utils/dom'
import './package/styles/index.less'

// 百度 114.036951,22.616594
// console.log(GPS_convert.bd09_To_Gcj02(114.036951, 22.616594))
// lon: 114.0303566387694, lat: 22.61058368460503

// 高德 114.036074,22.663532 (gcj)
// console.log(GPS_convert.gcj02_To_Bd09(114.036074, 22.663532))
// // lon: 114.0424463103124, lat: 22.669395420630227
// // 114.042523,22.669352

// http://api.map.baidu.com/place/v2/search?query=银行&location=39.915,116.404&radius=2000&output=xml&ak=您的密钥
/*
getPosition()
	.then((res) => {
	  console.log('get position ', res)
	  if (res.success) {
		const div = document.createElement('div')
		const {longitude, latitude} = res.data
		const point = GPS_convert.bd09_To_Gcj02(longitude, latitude)

		div.innerText = `
            您的位置: \n百度:经度: ${res.data.longitude}, 纬度: ${res.data.latitude}\n
            高德: 经度:${point.lng},纬度:${point.lat}
            `
		document.body.appendChild(div)
		API.getPoints(point)
			.then((res) => {
			  console.log('points ', res)
			})
			.catch(err => {
			  console.log(err)
			})
	  }
	})
*/

/*
* {"timeSpan":
* ["00:00-01:00","01:00-02:00","02:00-03:00","03:00-04:00","04:00-05:00","05:00-06:00","06:00-07:00","07:00-08:00","08:00-09:00","09:00-10:00","10:00-11:00","11:00-12:00","12:00-13:00","13:00-14:00","14:00-15:00","15:00-16:00","16:00-17:00","17:00-18:00","18:00-19:00","19:00-20:00","20:00-21:00","21:00-22:00","22:00-23:00","23:00-23:59"],
* "limitWeek":[1,2,3,4,5,6,7],
* "startTime":"2019/6/10 18:43:00",
* "endTime":"2019/6/17 16:42:59",
* "region":"龙华区,龙岗区,宝安区",
* "isNeedTime":true}
* */
const start = dayjs('2019/6/10 18:43:00');
const end = dayjs('2019/6/17 16:42:59');

(async () => {
  let time = '2019/06/01';
  let time2 = '';
  let address = {lng: '114.033734', lat: '22.663554'}
  const now = dayjs()
  const tMonth = dayjs().startOf('month') // 本月第一天
  const tHour = dayjs().startOf('date') // 本日 0:00:00
  const btn = document.getElementById('btn');
  const btn2 = document.getElementById('btn2');
  const region = await API.getRegion()
  console.log(region)

  // 选项校验函数,返回值作为 item的disabled
  // 今年之前的年份不可选
  const yearCheck = date => date.year() < now.year() || date.year() > end.year()

  // 本月1号之前的月份不可选
  const monthCheck = (date) => date.isBefore(tMonth) || date.isAfter(end.startOf('month'))

  // 今日0:00:00之前的日期不可选
  const dateCheck = date => date.isBefore(tHour) || date.isAfter(end)

  // 当前时间之前的时段不可选
  const spanCheck = date => date.isBefore(start)
  // 时段生成函数
  const getTimeSpan = ({year, month, date}) => {
	const list = [
	  {
		label: '09:00-12:00',
		value: '09:00-12:00',
	  },
	  {
		label: '13:00-16:00',
		value: '13:00-16:00',
	  },
	  {
		label: '18:00-20:00',
		value: '18:00-20:00',
	  },
	]
	return list.map(item => {
	  const time = item.value.split('-')[1]
	  const str = `${year}/${month}/${date} ${time}`
	  return {...item, disabled: spanCheck(dayjs(str))}
	})
  }
  btn.onclick = async function () {
	let result = await pickTime({
	  start, end,
	  value: time,
	  getTimeSpan,
	  yearCheck,
	  monthCheck,
	  dateCheck,
	});
	if (result.success) {
	  console.log(result.data)
	  time = result.data
	  document.getElementById('time').innerText = time
	}
  }

  btn2.addEventListener('click', async function f() {
	let result = await pickTime({
	  start, end, value: time2,
	})
	if (result.success) {
	  time2 = result.data
	  document.getElementById('time2').innerText = time2
	}
  })

  document.getElementById('btn3')
	  .addEventListener('click', async function () {
		if (!region.success) return
		let result = await addAddress({toast: window.Toast})

		console.log(result)
		if (result.success) {
		  address = result.data
		  const div = document.getElementById('address')
		  div.innerText = `
		  收货人: ${address.name} 
		  电话: ${address.mobile} 
		  地区: ${address.area} 
		  地址: ${address.address} 
		  `
		}
	  })

  await sleep(1000)
  // btn.click()
  document.getElementById('btn3').click()
})();




