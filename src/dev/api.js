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

export const getRegion = () => import('./region').then(res => ({success: true, data: fmtRegion(res.region)}))
