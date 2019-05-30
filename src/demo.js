// 未编译API,需要引入polyfill
import 'core-js'
import pickTime from './package/main'
import * as dayjs from 'dayjs';

const sleep = time => new Promise(resolve => setTimeout(resolve, time));
const fmt = d => d.format('YYYY-MM-DD HH:mm:ss');
import * as dom from './package/utils/dom'

const start = dayjs('2017/01/01');
const end = dayjs('2022/01/01');

(async () => {
  let time = '2019/06/01';
  let time2 = '';
  const today = dayjs()
  const tMonth = dayjs().startOf('month') // 本月第一天
  const tHour = dayjs().startOf('date') // 本日 0:00:00
  const btn = document.getElementById('btn');
  const btn2 = document.getElementById('btn2');

  // 选项校验函数,返回值作为 item的disabled
  // 今年之前的年份不可选
  const yearCheck = date => date.year() < today.year()

  // 本月1号之前的月份不可选
  const monthCheck = (date) => date.isBefore(tMonth)

  // 今日0:00:00之前的日期不可选
  const dateCheck = date => date.isBefore(tHour)

  // 当前时间之前的时段不可选
  const spanCheck = date => date.isBefore(today)
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
	console.log('-------------span creator --------------')
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

  await sleep(1000)
  btn.click()

})();




