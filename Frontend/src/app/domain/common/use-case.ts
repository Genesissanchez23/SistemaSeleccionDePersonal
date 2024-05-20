import { Observable } from 'rxjs';

export interface UseCase<S, T> {
    perform(params: S): Observable<T>;
}