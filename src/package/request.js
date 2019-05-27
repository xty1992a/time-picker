// https://www.yunhuiyuan.cn/UploadFile/UploadSingleImage?isCompress=true
function formatResult(raw) {
  let result = raw
  try {
	result = JSON.parse(raw)
  } catch (e) {
	console.log(e)
  }
  return result
}

export default function (url, data) {
  return new Promise((resolve, reject) => {
	const xhr = new XMLHttpRequest();
	xhr.open('POST', url);
	if (!data instanceof FormData) {
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
	}
	xhr.send(data);
	xhr.onreadystatechange = function () {
	  const DONE = 4; // readyState 4 代表已向服务器发送请求
	  const OK = 200; // status 200 代表服务器返回成功
	  if (xhr.readyState === DONE) {
		if (xhr.status === OK) {
		  resolve(formatResult(xhr.responseText))
		}
		else {
		  console.log('Error: ' + xhr.status); // 在此次请求中发生的错误
		  reject(xhr.status)
		}
	  }
	}
  })

}
