const dayjs = require('dayjs');

const year = {
  label: '2017年',
  value: dayjs(),
  // children:
}

const tree = [
  {
    label: '2017年',
	value: 2017,
	children: [
	  {
	    label: '1月',
		// value:
	  }
	]
  }
]


function downImage(src, name, MIME, callback) {
  name = name ||  Date.now()
  MIME = MIME || 'png'
	let img = new Image()
	img.setAttribute('crossOrigin', 'Anonymous')
	img.src = src
	let cvs = document.createElement('canvas')
	let ctx = cvs.getContext('2d')
	img.addEventListener('load', function ()  {
	  cvs.width = img.width
	  cvs.height = img.height
	  ctx.drawImage(img, 0, 0)
	  try {
		let url = cvs.toDataURL('image/' + MIME)
		const link = document.createElement('a')
		link.href = url
		link.download = `${name}.${MIME}`
		link.click()
		callback(true)
	  } catch (e) {
		callback(false)
	  }
	})
	img.addEventListener('error', function () {
	  callback(false)
	})
}
