const PI = Math.PI * 3000.0 / 180.0

export function bd09_To_Gcj02(bd_lon: number, bd_lng: number) {
    const x: number = bd_lon - 0.0065, y: number = bd_lng - 0.006
    const z: number = Math.sqrt(x * x + y * y) - 0.0002 * Math.sin(y * PI)
    const theta: number = Math.atan2(y, x) - 0.000003 * Math.cos(x * PI)
    return {
        lng: z * Math.cos(theta),
        lat: z * Math.sin(theta)
    }
}

export function gcj02_To_Bd09(gg_lon: number, gg_lat: number) {
    const x: number = gg_lon, y: number = gg_lat
    const z: number = Math.sqrt(x * x + y * y) + 0.0002 * Math.sin(y * PI)
    const theta: number = Math.atan2(y, x) + 0.000003 * Math.cos(x * PI)
    return {
        lng: z * Math.cos(theta) + 0.0065,
        lat: z * Math.sin(theta) + 0.006
    }
}

