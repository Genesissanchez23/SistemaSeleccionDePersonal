/**
    * Clase abstracta Mapper para definir métodos de mapeo entre dos tipos.
    * 
    * @template I Tipo de entrada para el mapeo.
    * @template O Tipo de salida para el mapeo.
*/
export abstract class Mapper<I, O> {

    /**
        * Método abstracto para mapear desde el tipo I al tipo O.
        * 
        * @param {I} param Objeto de tipo I que se va a mapear.
        * @returns {O} Objeto de tipo O resultante del mapeo.
    */
    abstract mapFrom(param: I): O;

    /**
        * Método abstracto para mapear desde el tipo O al tipo I.
        * 
        * @param {O} param Objeto de tipo O que se va a mapear.
        * @returns {I} Objeto de tipo I resultante del mapeo.
    */
    abstract mapTo(param: O): I;

}
