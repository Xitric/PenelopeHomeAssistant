import * as qs from 'querystring'
import {QueryParameters} from '../types/shared-types'

export function addQueryParameters(path: string, queryParams: QueryParameters): string {
    let expandedPath = path + '?'

    Object.entries(queryParams).forEach(([parameter, value]) => {
        expandedPath += `${parameter}=${qs.escape(value.toString())}&`
    })

    return expandedPath.substr(0, expandedPath.length - 1)
}
