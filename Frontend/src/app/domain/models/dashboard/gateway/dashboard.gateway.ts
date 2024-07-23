// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Modelos de dominio utilizados por el gateway
import { CategoryData, DataItems, DataItemsUno } from "../dashboard.model";

/**
    * Interfaz abstracta que define las operaciones relacionadas con los datos del dashboard.
    * Se utiliza como un gateway para comunicarse con el backend o almacenamiento de datos.
*/
@Injectable({
    providedIn: 'root'
})
export abstract class DashboardGateway {

    /**
        * Método abstracto para obtener los datos de la primera tarjeta del dashboard.
        *
        * @returns {Observable<DataItemsUno[]>} Observable que emite una lista de items de datos.
    */
    abstract getCardUno(): Observable<DataItemsUno[]>;
    
    /**
        * Método abstracto para obtener los datos de la segunda tarjeta del dashboard.
        *
        * @returns {Observable<CategoryData[]>} Observable que emite una lista de categorías con sus series de datos.
    */
    abstract getCardDos(): Observable<CategoryData[]>;
    
    /**
        * Método abstracto para obtener los datos de la tercera tarjeta del dashboard.
        *
        * @returns {Observable<DataItems[]>} Observable que emite una lista de items de datos.
    */
    abstract getCardTres(): Observable<DataItems[]>;
    
    /**
        * Método abstracto para obtener los datos de la cuarta tarjeta del dashboard.
        *
        * @returns {Observable<CategoryData[]>} Observable que emite una lista de categorías con sus series de datos.
    */
    abstract getCardCuatro(): Observable<CategoryData[]>;

    /**
        * Método abstracto para obtener los datos de la quinta tarjeta del dashboard.
        *
        * @returns {Observable<DataItems[]>} Observable que emite una lista de items de datos.
    */
    abstract getCardCinco(): Observable<DataItems[]>;

}