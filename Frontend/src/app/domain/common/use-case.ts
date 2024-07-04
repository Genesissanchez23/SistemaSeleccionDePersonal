import { Observable } from 'rxjs';

/**
    * Interfaz genérica para definir un caso de uso.
    *
    * @template S - Tipo de parámetros de entrada para el caso de uso.
    * @template T - Tipo de resultado de salida del caso de uso.
*/
export interface UseCase<S, T> {
    /**
        * Método para ejecutar el caso de uso con los parámetros proporcionados.
        *
        * @param {S} params - Parámetros de entrada para el caso de uso.
        * @returns {Observable<T>} Observable que emite el resultado del caso de uso.
    */
    perform(params: S): Observable<T>;
}
