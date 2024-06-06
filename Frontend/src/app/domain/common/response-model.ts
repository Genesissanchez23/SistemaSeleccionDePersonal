export interface ResponseModel<T = any> {
    status: boolean
    body: T
}