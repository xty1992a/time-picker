export const storage = {
    getItem(key: string): (object | string) {
        try {
            return JSON.parse(sessionStorage.getItem(key))
        } catch (e) {
            return sessionStorage.getItem(key)
        }
    },
    setItem(key: string, data: any) {
        try {
            sessionStorage.setItem(key, JSON.stringify(data))
        } catch (e) {
            sessionStorage.setItem(key, data.toString())
        }
    },
}

export const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time));
export const frame = () => requestAnimationFrame ? new Promise(requestAnimationFrame) : sleep(16);
export const Tween = {
    Linear: function (t: number, b: number, c: number, d: number) {
        return c * t / d + b;
    },
}

interface TweenManagerProps {
    end: number,
    start: number,
    duration?: number,
    easing: Function
}

const dftOption = {
    duration: 300,
    start: 0,
    end: 0,
    easing: Tween.Linear,
}

export class TweenManager {
    $options: TweenManagerProps
    stamp: number

    get distance() {
        return this.$options.end - this.$options.start
    }

    get currentStep() {
        return TweenManager.now - this.stamp
    }

    get currentValue() {
        const {distance, currentStep} = this
        const {duration, easing, start} = this.$options
        return easing(currentStep, start, distance, duration)
    }

    constructor(opt = {}) {
        this.$options = {...dftOption, ...opt}
        this.stamp = TweenManager.now
    }

    next() {
        return this.$options.duration > this.currentStep
    }

    static get now() {
        return Date.now ? Date.now() : new Date().getTime()
    }

    static sleep = sleep

    static frame = frame
}
