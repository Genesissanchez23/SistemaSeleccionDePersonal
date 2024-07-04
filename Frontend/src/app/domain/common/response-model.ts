/**
 * Interfaz genérica para representar la estructura de una respuesta.
 *
 * @template T - Tipo de datos que contendrá el cuerpo de la respuesta.
 */
export interface ResponseModel<T = any> {
    /**
     * Estado de la respuesta, `true` si la operación fue exitosa.
     */
    status: boolean;
    
    /**
     * Cuerpo de la respuesta, de tipo genérico para permitir flexibilidad.
     * 
     * @type {T}
     */
    body: T;
}
