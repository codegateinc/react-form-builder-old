import { toPairs, cond, is, fromPairs, always, T } from 'ramda'

/* tslint:disable no-any */
const isDefined = (subject: any) => typeof subject !== 'undefined' && subject !== null
const isEqual = <T = {}>(comparator: any, followingValue?: any) => (value: T) => is(Function, comparator) ?
    comparator(value) === followingValue :
    value === comparator
/* tslint:enable no-any */

const all = (...args: Array<boolean>) => !args.some(arg => !Boolean(arg))

export {
    toPairs,
    cond,
    is,
    fromPairs,
    isEqual,
    isDefined,
    all,
    always,
    T
}
