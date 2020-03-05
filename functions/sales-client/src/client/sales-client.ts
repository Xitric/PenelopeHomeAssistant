import * as crypto from 'crypto'
import * as HttpsWrapper from '../https/https-wrapper'
import {Endpoint, Parameter} from '../types/api-constants'

interface TokenResponse {
    readonly token: string
    readonly expires: string
    readonly client_id: string
}

export interface ClientConfig {
    readonly apiKey: string
    readonly apiSecret: string
    readonly host: string
}

export class SalesClient {

    private readonly apiKey: string
    private readonly apiSecret: string
    private readonly baseHost: string

    constructor(config: ClientConfig) {
        this.apiKey = config.apiKey
        this.apiSecret = config.apiSecret
        this.baseHost = config.host
    }

    sign(token: string): string {
        return crypto
            .createHash('sha256')
            .update(this.apiSecret + token)
            .digest('hex')
    }

    /**
     * Create a new user session which is required for calling other API endpoints.
     */
    async createSession(ttl: number = 3888000): Promise<string> {
        const response = await HttpsWrapper.post<TokenResponse>({
            hostname: this.baseHost,
            path: Endpoint.SESSIONS
        }, {
            [Parameter.TOKEN_TTL]: ttl,
            [Parameter.API_KEY]: this.apiKey
        })

        return this.sign(response.token)
    }
}
