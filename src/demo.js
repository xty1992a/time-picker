// 未编译API,需要引入polyfill
import 'core-js'
import pickTime from './package/TimeAction'

(async () => {
  let time = null;
  document.getElementById('btn').onclick = async function () {
	let result = await pickTime({
	  value: time,
	});
	if (result.success) {
	  console.log(result.data)
	  // time = result.data
	  // document.getElementById('store').innerText = `你选择了${store}`
	}
  }
})();




