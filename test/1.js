const sleep = time => new Promise(resolve => setTimeout(resolve, time));

let count = 0
const request = () => new Promise(resolve => setTimeout(() => resolve({
  success: ++count === 10,
})))

async function loop(maxRequestCount = 5) {
  return new Promise(async resolve => {
	let requestCount = 0
	let result = {success: false}

	while (!result.success) {
	  requestCount++
	  result = await request()
	  console.log(result, count)
	  if (!result.success && requestCount > maxRequestCount) {
		return resolve({success: false, message: 'request count out !'})
	  }
	  await sleep(1000)
	}
	resolve({success: true, message: 'request success'})
  })
}

loop(10)
	.then(res => {
	  console.log(res)
	})
