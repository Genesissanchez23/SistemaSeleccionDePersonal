// RxJS para manejo de Observables
import { Observable } from "rxjs";

// Injectable para la inyección de dependencias en Angular
import { Injectable } from "@angular/core";

// Importaciones de casos de uso y modelos de dominio
import { UseCase } from "@domain/common/use-case";
import { DataItems } from "@domain/models/dashboard/dashboard.model";
import { DashboardGateway } from "@domain/models/dashboard/gateway/dashboard.gateway";

/**
  * Caso de uso concreto para obtener los datos de la tercera tarjeta del dashboard.
  * Implementa la interfaz UseCase para definir la operación `perform`.
*/
@Injectable({
  providedIn: 'root'
})
export class DashboardTresUsecase implements UseCase<void, DataItems[]> {

  /**
    * Constructor que inyecta el gateway del dashboard.
    *
    * @param {DashboardGateway} _dashboardGateway - Gateway utilizado para obtener los datos del dashboard.
  */
  constructor(private _dashboardGateway: DashboardGateway) { }

  /**
    * Método `perform` implementado desde la interfaz UseCase.
    * Invoca el método `getCardTres` del DashboardGateway para obtener los datos de la tercera tarjeta del dashboard.
    *
    * @returns {Observable<DataItems[]>} Observable que emite una respuesta con los datos de la tercera tarjeta del dashboard.
  */
  perform(): Observable<DataItems[]> {
    return this._dashboardGateway.getCardTres();
  }
}
