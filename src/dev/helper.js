export const getPosition = () => new Promise(resolve => {
    if ('geolocation' in navigator) {
        console.log('navgator include geolocation ')
        navigator.geolocation.getCurrentPosition((position)=> {
            resolve(position)
        });
    } else {
        resolve(null)
    }
})