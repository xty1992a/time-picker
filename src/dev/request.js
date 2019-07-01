// https://www.yunhuiyuan.cn/UploadFile/UploadSingleImage?isCompress=true
function formatResult(raw) {
  let result = raw
  try {
	result = JSON.parse(raw)
  } catch (e) {
	console.log(raw, 'formatResult error', e)
  }
  return result
}

export default function (url, data, method, progress) {
  return new Promise((resolve, reject) => {
	const xhr = new XMLHttpRequest();
	xhr.open(method || 'POST', url);
	xhr.send(data);
	xhr.onreadystatechange = function () {
	  const DONE = 4;
	  if (xhr.readyState === DONE) {
		console.log(xhr.status, xhr.responseXML, ' request complete')
		if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 0) {
		  resolve(formatResult(xhr.responseText))
		}
		else {
		  console.log('Error: ' + xhr.status);
		  reject(xhr.status)
		}
	  }
	}

	function progressHandler(event) {
	  if (event.lengthComputable) {
		process && progress(Math.floor(event.loaded / event.total * 100))
	  }
	}

	if (progress) {
	  xhr.addEventListener('progress', progressHandler)
	}
	if (xhr.upload && progress) {
	  xhr.upload.addEventListener('progress', progressHandler)
	}
  })
}
