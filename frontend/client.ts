
import type { CookieWithOptions } from "encore.dev/api";

/**
 * BaseURL is the base URL for calling the Encore application's API.
 */
export type BaseURL = string

export const Local: BaseURL = "http://localhost:4000"

/**
 * Environment returns a BaseURL for calling the cloud environment with the given name.
 */
export function Environment(name: string): BaseURL {
    return `https://${name}-.encr.app`
}

/**
 * PreviewEnv returns a BaseURL for calling the preview environment with the given PR number.
 */
export function PreviewEnv(pr: number | string): BaseURL {
    return Environment(`pr${pr}`)
}

const BROWSER = typeof globalThis === "object" && ("window" in globalThis);

/**
 * Client is an API client for the  Encore application.
 */
export class Client {
    public readonly doctor: doctor.ServiceClient
    private readonly options: ClientOptions
    private readonly target: string


    /**
     * Creates a Client for calling the public and authenticated APIs of your Encore application.
     *
     * @param target  The target which the client should be configured to use. See Local and Environment for options.
     * @param options Options for the client
     */
    constructor(target: BaseURL, options?: ClientOptions) {
        this.target = target
        this.options = options ?? {}
        const base = new BaseClient(this.target, this.options)
        this.doctor = new doctor.ServiceClient(base)
    }

    /**
     * Creates a new Encore client with the given client options set.
     *
     * @param options Client options to set. They are merged with existing options.
     **/
    public with(options: ClientOptions): Client {
        return new Client(this.target, {
            ...this.options,
            ...options,
        })
    }
}

/**
 * ClientOptions allows you to override any default behaviour within the generated Encore client.
 */
export interface ClientOptions {
    /**
     * By default the client will use the inbuilt fetch function for making the API requests.
     * however you can override it with your own implementation here if you want to run custom
     * code on each API request made or response received.
     */
    fetcher?: Fetcher

    /** Default RequestInit to be used for the client */
    requestInit?: Omit<RequestInit, "headers"> & { headers?: Record<string, string> }
}

/**
 * Import the endpoint handlers to derive the types for the client.
 */
import { get as api_doctor_get_get } from "~backend/doctor/get";
import { search as api_doctor_search_search } from "~backend/doctor/search";

export namespace doctor {

    export class ServiceClient {
        private baseClient: BaseClient

        constructor(baseClient: BaseClient) {
            this.baseClient = baseClient
            this.get = this.get.bind(this)
            this.search = this.search.bind(this)
        }

        /**
         * Retrieves a specific doctor by ID.
         */
        public async get(params: { id: number }): Promise<ResponseType<typeof api_doctor_get_get>> {
            // Now make the actual call to the API
            const resp = await this.baseClient.callTypedAPI(`/doctors/${encodeURIComponent(params.id)}`, {method: "GET", body: undefined})
            return JSON.parse(await resp.text(), dateReviver) as ResponseType<typeof api_doctor_get_get>
        }

        /**
         * Searches for doctors based on location and specialization.
         */
        public async search(params: RequestType<typeof api_doctor_search_search>): Promise<ResponseType<typeof api_doctor_search_search>> {
            // Convert our params into the objects we need for the request
            const query = makeRecord<string, string | string[]>({
                limit:          params.limit === undefined ? undefined : String(params.limit),
                location:       params.location,
                offset:         params.offset === undefined ? undefined : String(params.offset),
                specialization: params.specialization,
            })

            // Now make the actual call to the API
            const resp = await this.baseClient.callTypedAPI(`/doctors/search`, {query, method: "GET", body: undefined})
            return JSON.parse(await resp.text(), dateReviver) as ResponseType<typeof api_doctor_search_search>
        }
    }
}


type PickMethods<Type> = Omit<CallParameters, "method"> & { method?: Type };

// Helper type to omit all fields that are cookies.
type OmitCookie<T> = {
  [K in keyof T as T[K] extends CookieWithOptions<any> ? never : K]: T[K];
};

type RequestType<Type extends (...args: any[]) => any> =
  Parameters<Type> extends [infer H, ...any[]]
    ? OmitCookie<H>
    : void;

type ResponseType<Type extends (...args: any[]) => any> = OmitCookie<Awaited<ReturnType<Type>>>;

function dateReviver(key: string, value: any): any {
  if (
    typeof value === "string" &&
    value.length >= 10 &&
    value.charCodeAt(0) >= 48 && // '0'
    value.charCodeAt(0) <= 57 // '9'
  ) {
    const parsedDate = new Date(value);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }
  return value;
}


function encodeQuery(parts: Record<string, string | string[]>): string {
    const pairs: string[] = []
    for (const key in parts) {
        const val = (Array.isArray(parts[key]) ?  parts[key] : [parts[key]]) as string[]
        for (const v of val) {
            pairs.push(`${key}=${encodeURIComponent(v)}`)
        }
    }
    return pairs.join("&")
}

// makeRecord takes a record and strips any undefined values from it,
// and returns the same record with a narrower type.
// @ts-ignore - TS ignore because makeRecord is not always used
function makeRecord<K extends string | number | symbol, V>(record: Record<K, V | undefined>): Record<K, V> {
    for (const key in record) {
        if (record[key] === undefined) {
            delete record[key]
        }
    }
    return record as Record<K, V>
}

import {
  StreamInOutHandlerFn,
  StreamInHandlerFn,
  StreamOutHandlerFn,
} from "encore.dev/api";

type StreamRequest<Type> = Type extends
  | StreamInOutHandlerFn<any, infer Req, any>
  | StreamInHandlerFn<any, infer Req, any>
  | StreamOutHandlerFn<any, any>
  ? Req
  : never;

type StreamResponse<Type> = Type extends
  | StreamInOutHandlerFn<any, any, infer Resp>
  | StreamInHandlerFn<any, any, infer Resp>
  | StreamOutHandlerFn<any, infer Resp>
  ? Resp
  : never;


function encodeWebSocketHeaders(headers: Record<string, string>) {
    // url safe, no pad
    const base64encoded = btoa(JSON.stringify(headers))
      .replaceAll("=", "")
      .replaceAll("+", "-")
      .replaceAll("/", "_");
    return "encore.dev.headers." + base64encoded;
}

class WebSocketConnection {
    public ws: WebSocket;

    private hasUpdateHandlers: (() => void)[] = [];

    constructor(url: string, headers?: Record<string, string>) {
        let protocols = ["encore-ws"];
        if (headers) {
            protocols.push(encodeWebSocketHeaders(headers))
        }

        this.ws = new WebSocket(url, protocols)

        this.on("error", () => {
            this.resolveHasUpdateHandlers();
        });

        this.on("close", () => {
            this.resolveHasUpdateHandlers();
        });
    }

    resolveHasUpdateHandlers() {
        const handlers = this.hasUpdateHandlers;
        this.hasUpdateHandlers = [];

        for (const handler of handlers) {
            handler()
        }
    }

    async hasUpdate() {
        // await until a new message have been received, or the socket is closed
        await new Promise((resolve) => {
            this.hasUpdateHandlers.push(() => resolve(null))
        });
    }

    on(type: "error" | "close" | "message" | "open", handler: (event: any) => void) {
        this.ws.addEventListener(type, handler);
    }

    off(type: "error" | "close" | "message" | "open", handler: (event: any) => void) {
        this.ws.removeEventListener(type, handler);
    }

    close() {
        this.ws.close();
    }
}

export class StreamInOut<Request, Response> {
    public socket: WebSocketConnection;
    private buffer: Response[] = [];

    constructor(url: string, headers?: Record<string, string>) {
        this.socket = new WebSocketConnection(url, headers);
        this.socket.on("message", (event: any) => {
            this.buffer.push(JSON.parse(event.data, dateReviver));
            this.socket.resolveHasUpdateHandlers();
        });
    }

    close() {
        this.socket.close();
    }

    async send(msg: Request) {
        if (this.socket.ws.readyState === WebSocket.CONNECTING) {
            // await that the socket is opened
            await new Promise((resolve) => {
                this.socket.ws.addEventListener("open", resolve, { once: true });
            });
        }

        return this.socket.ws.send(JSON.stringify(msg));
    }

    async next(): Promise<Response | undefined> {
        for await (const next of this) return next;
        return undefined;
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<Response, undefined, void> {
        while (true) {
            if (this.buffer.length > 0) {
                yield this.buffer.shift() as Response;
            } else {
                if (this.socket.ws.readyState === WebSocket.CLOSED) return;
                await this.socket.hasUpdate();
            }
        }
    }
}

export class StreamIn<Response> {
    public socket: WebSocketConnection;
    private buffer: Response[] = [];

    constructor(url: string, headers?: Record<string, string>) {
        this.socket = new WebSocketConnection(url, headers);
        this.socket.on("message", (event: any) => {
            this.buffer.push(JSON.parse(event.data, dateReviver));
            this.socket.resolveHasUpdateHandlers();
        });
    }

    close() {
        this.socket.close();
    }

    async next(): Promise<Response | undefined> {
        for await (const next of this) return next;
        return undefined;
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<Response, undefined, void> {
        while (true) {
            if (this.buffer.length > 0) {
                yield this.buffer.shift() as Response;
            } else {
                if (this.socket.ws.readyState === WebSocket.CLOSED) return;
                await this.socket.hasUpdate();
            }
        }
    }
}

export class StreamOut<Request, Response> {
    public socket: WebSocketConnection;
    private responseValue: Promise<Response>;

    constructor(url: string, headers?: Record<string, string>) {
        let responseResolver: (_: any) => void;
        this.responseValue = new Promise((resolve) => responseResolver = resolve);

        this.socket = new WebSocketConnection(url, headers);
        this.socket.on("message", (event: any) => {
            responseResolver(JSON.parse(event.data, dateReviver))
        });
    }

    async response(): Promise<Response> {
        return this.responseValue;
    }

    close() {
        this.socket.close();
    }

    async send(msg: Request) {
        if (this.socket.ws.readyState === WebSocket.CONNECTING) {
            // await that the socket is opened
            await new Promise((resolve) => {
                this.socket.ws.addEventListener("open", resolve, { once: true });
            });
        }

        return this.socket.ws.send(JSON.stringify(msg));
    }
}
// CallParameters is the type of the parameters to a method call, but require headers to be a Record type
type CallParameters = Omit<RequestInit, "headers"> & {
    /** Headers to be sent with the request */
    headers?: Record<string, string>

    /** Query parameters to be sent with the request */
    query?: Record<string, string | string[]>
}


// A fetcher is the prototype for the inbuilt Fetch function
export type Fetcher = typeof fetch;

const boundFetch = fetch.bind(this);

class BaseClient {
    readonly baseURL: string
    readonly fetcher: Fetcher
    readonly headers: Record<string, string>
    readonly requestInit: Omit<RequestInit, "headers"> & { headers?: Record<string, string> }

    constructor(baseURL: string, options: ClientOptions) {
        this.baseURL = baseURL
        this.headers = {}

        // Add User-Agent header if the script is running in the server
        // because browsers do not allow setting User-Agent headers to requests
        if (!BROWSER) {
            this.headers["User-Agent"] = "-Generated-TS-Client (Encore/1.48.8)";
        }

        this.requestInit = options.requestInit ?? {};

        // Setup what fetch function we'll be using in the base client
        if (options.fetcher !== undefined) {
            this.fetcher = options.fetcher
        } else {
            this.fetcher = boundFetch
        }
    }

    async getAuthData(): Promise<CallParameters | undefined> {
        return undefined;
    }

    // createStreamInOut sets up a stream to a streaming API endpoint.
    async createStreamInOut<Request, Response>(path: string, params?: CallParameters): Promise<StreamInOut<Request, Response>> {
        let { query, headers } = params ?? {};

        // Fetch auth data if there is any
        const authData = await this.getAuthData();

        // If we now have authentication data, add it to the request
        if (authData) {
            if (authData.query) {
                query = {...query, ...authData.query};
            }
            if (authData.headers) {
                headers = {...headers, ...authData.headers};
            }
        }

        const queryString = query ? '?' + encodeQuery(query) : ''
        return new StreamInOut(this.baseURL + path + queryString, headers);
    }

    // createStreamIn sets up a stream to a streaming API endpoint.
    async createStreamIn<Response>(path: string, params?: CallParameters): Promise<StreamIn<Response>> {
        let { query, headers } = params ?? {};

        // Fetch auth data if there is any
        const authData = await this.getAuthData();

        // If we now have authentication data, add it to the request
        if (authData) {
            if (authData.query) {
                query = {...query, ...authData.query};
            }
            if (authData.headers) {
                headers = {...headers, ...authData.headers};
            }
        }

        const queryString = query ? '?' + encodeQuery(query) : ''
        return new StreamIn(this.baseURL + path + queryString, headers);
    }

    // createStreamOut sets up a stream to a streaming API endpoint.
    async createStreamOut<Request, Response>(path: string, params?: CallParameters): Promise<StreamOut<Request, Response>> {
        let { query, headers } = params ?? {};

        // Fetch auth data if there is any
        const authData = await this.getAuthData();

        // If we now have authentication data, add it to the request
        if (authData) {
            if (authData.query) {
                query = {...query, ...authData.query};
            }
            if (authData.headers) {
                headers = {...headers, ...authData.headers};
            }
        }

        const queryString = query ? '?' + encodeQuery(query) : ''
        return new StreamOut(this.baseURL + path + queryString, headers);
    }

    // callTypedAPI makes an API call, defaulting content type to "application/json"
    public async callTypedAPI(path: string, params?: CallParameters): Promise<Response> {
        return this.callAPI(path, {
            ...params,
            headers: { "Content-Type": "application/json", ...params?.headers }
        });
    }

    // callAPI is used by each generated API method to actually make the request
    public async callAPI(path: string, params?: CallParameters): Promise<Response> {
        let { query, headers, ...rest } = params ?? {}
        const init = {
            ...this.requestInit,
            ...rest,
        }

        // Merge our headers with any predefined headers
        init.headers = {...this.headers, ...init.headers, ...headers}

        // Fetch auth data if there is any
        const authData = await this.getAuthData();

        // If we now have authentication data, add it to the request
        if (authData) {
            if (authData.query) {
                query = {...query, ...authData.query};
            }
            if (authData.headers) {
                init.headers = {...init.headers, ...authData.headers};
            }
        }

        // Make the actual request
        const queryString = query ? '?' + encodeQuery(query) : ''
        const response = await this.fetcher(this.baseURL+path+queryString, init)

        // handle any error responses
        if (!response.ok) {
            // try and get the error message from the response body
            let body: APIErrorResponse = { code: ErrCode.Unknown, message: `request failed: status ${response.status}` }

            // if we can get the structured error we should, otherwise give a best effort
            try {
                const text = await response.text()

                try {
                    const jsonBody = JSON.parse(text)
                    if (isAPIErrorResponse(jsonBody)) {
                        body = jsonBody
                    } else {
                        body.message += ": " + JSON.stringify(jsonBody)
                    }
                } catch {
                    body.message += ": " + text
                }
            } catch (e) {
                // otherwise we just append the text to the error message
                body.message += ": " + String(e)
            }

            throw new APIError(response.status, body)
        }

        return response
    }
}

/**
 * APIErrorDetails represents the response from an Encore API in the case of an error
 */
interface APIErrorResponse {
    code: ErrCode
    message: string
    details?: any
}

function isAPIErrorResponse(err: any): err is APIErrorResponse {
    return (
        err !== undefined && err !== null &&
        isErrCode(err.code) &&
        typeof(err.message) === "string" &&
        (err.details === undefined || err.details === null || typeof(err.details) === "object")
    )
}

function isErrCode(code: any): code is ErrCode {
    return code !== undefined && Object.values(ErrCode).includes(code)
}

/**
 * APIError represents a structured error as returned from an Encore application.
 */
export class APIError extends Error {
    /**
     * The HTTP status code associated with the error.
     */
    public readonly status: number

    /**
     * The Encore error code
     */
    public readonly code: ErrCode

    /**
     * The error details
     */
    public readonly details?: any

    constructor(status: number, response: APIErrorResponse) {
        
        super(response.message);

        
        Object.defineProperty(this, 'name', {
            value:        'APIError',
            enumerable:   false,
            configurable: true,
        })

        // fix the prototype chain
        if ((Object as any).setPrototypeOf == undefined) {
            (this as any).__proto__ = APIError.prototype
        } else {
            Object.setPrototypeOf(this, APIError.prototype);
        }

        // capture a stack trace
        if ((Error as any).captureStackTrace !== undefined) {
            (Error as any).captureStackTrace(this, this.constructor);
        }

        this.status = status
        this.code = response.code
        this.details = response.details
    }
}


export function isAPIError(err: any): err is APIError {
    return err instanceof APIError;
}

export enum ErrCode {
   
    OK = "ok",
    Canceled = "canceled",
    Unknown = "unknown",
    InvalidArgument = "invalid_argument",
    DeadlineExceeded = "deadline_exceeded",
    NotFound = "not_found",
    AlreadyExists = "already_exists",
    PermissionDenied = "permission_denied",
    ResourceExhausted = "resource_exhausted",
    FailedPrecondition = "failed_precondition",
    Aborted = "aborted",
    OutOfRange = "out_of_range",
    Unimplemented = "unimplemented",
    Internal = "internal",
    Unavailable = "unavailable",
    DataLoss = "data_loss",  
    Unauthenticated = "unauthenticated",
}

export default new Client(import.meta.env.VITE_CLIENT_TARGET, { requestInit: { credentials: "include" } });
