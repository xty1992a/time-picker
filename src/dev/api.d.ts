interface Result {
    data: object,
    message: string,
    success: boolean
}

interface RequestFn {
    (params?: any): Promise<Result>
}

export const getRegion: RequestFn
export const address2geo: RequestFn
export const getPoints: RequestFn
