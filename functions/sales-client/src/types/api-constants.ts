const V: string = '/v2'

export const Endpoint: { [key: string]: string } = {
    SESSIONS: `${V}/sessions`
}

export const Parameter: { [key: string]: string } = {
    TOKEN_TTL: 'token_ttl',
    API_KEY: 'api_key'
}
