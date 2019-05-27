import request from '../package/request'

const BID = 'e02cbb7b-a9e7-e311-a603-90b11c47e695'

// 登录
export const login = () => new Promise(resolve => {
	request('/Business/BindByCardAction?cardId=18602098232&password=888888&bid=' + BID)
		.then(res => {
			resolve(res)
		})
		.catch(e => {
			resolve({ success: false, data: e })
		})
})
// 获取提货门店列表
// api/Shop/GetChainStores?pageIndex=1&pageSize=10
export const getList = params => new Promise(resolve => {
	let { pageIndex, pageSize, keywords } = params
	const reqData = {
		bid: BID,
		searchStr: keywords,
		pageSize,
		pageIndex,
		localLat: 22.54605355,
		localLon: 114.02597366,
		activityGuid: '',
		isPickup: true,
		goodsItemList: ['f0032574-37a0-e711-af6e-0010184dbd22'],
	}
	request(`/api/Shop/GetChainStores?pageIndex=${pageIndex}&pageSize=${pageSize}`, JSON.stringify(reqData))
		.then(res => {
			resolve(res)
		})
		.catch(err => {
			resolve({ success: false, data: err })
		})
});

export const getStore = params => new Promise(resolve => {
	let { pageIndex,  keywords , pageSize, lat = 0, lng = 0} = params
	const url = '/UPay/GetChainStoreList?bid=' + BID

	const req = {
		storeListTypeStr: 'UPay',
		searchStr: keywords,
		pageSize,
		pageIndex,
		localLat: lat,
		localLon: lng,
		activityGuid: '',
    }
    
	const form = new FormData()
	Object.keys(req).forEach(k => form.append(k, req[k]))

	request(url, form)
		.then(res => {
			resolve(res)
		})
		.catch(e => {
			resolve({ success: false, data: e })
		})
});