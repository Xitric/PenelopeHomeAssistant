import * as https from 'https'
import * as QueryResolver from './query-resolver'
import {QueryParameters} from '../types/shared-types'

export async function get<T>(options: https.RequestOptions, queryParams?: QueryParameters): Promise<T> {
    return perform<T>(options, 'GET', queryParams)
}

export async function post<T>(options: https.RequestOptions, queryParams?: QueryParameters, data?: any): Promise<T>
export async function post<T>(options: https.RequestOptions, data: any): Promise<T>
export async function post<T>(options: https.RequestOptions, queryParams?: QueryParameters, data?: any): Promise<T> {
    return perform<T>(options, 'POST', queryParams, data)
}

export async function put<T>(options: https.RequestOptions, queryParams?: QueryParameters, data?: any): Promise<T>
export async function put<T>(options: https.RequestOptions, data: any): Promise<T>
export async function put<T>(options: https.RequestOptions, queryParams?: QueryParameters, data?: any): Promise<T> {
    return perform<T>(options, 'PUT', queryParams, data)
}

async function perform<T>(options: https.RequestOptions, method: string, queryParams?: QueryParameters, data?: any): Promise<T> {
    if (options.path && queryParams) {
        options.path = QueryResolver.addQueryParameters(options.path, queryParams)
    }
    options.method = method

    return new Promise<T>((resolve, reject) => {
        const req = https.request(options, res => {

            if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
                reject(new Error(`HTTPS request failed with status code ${res.statusCode}: ${res.statusMessage}`))
                res.resume()
            }

            res.on('error', error => {
                reject(error)
                res.resume()
            })

            let dataBuffer = ''
            res.on('data', chunk => {
                dataBuffer += chunk
            })

            res.on('end', () => {
                let json = null
                try {
                    json = JSON.parse(dataBuffer)
                } catch (e) {
                    reject(new TypeError(`Unable to parse server response:\n${dataBuffer}`))
                    res.resume()
                }
                resolve(json)
            })
        })

        req.on('error', error => {
            reject(error)
        })

        if (data) req.write(data)
        req.end()
    })
}
