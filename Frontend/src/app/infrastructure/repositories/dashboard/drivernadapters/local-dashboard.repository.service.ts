// Importación de módulos y clases necesarias
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Importación del entorno de configuración
import { environment } from '@environment/environment';

// Importación de entidades y mapeadores de la infraestructura
import { DashboardGateway } from '@domain/models/dashboard/gateway/dashboard.gateway';
import { DataItemsUno, CategoryData, DataItems } from '@domain/models/dashboard/dashboard.model';


@Injectable({
  providedIn: 'root'
})
export class LocalDashboardRepositoryService extends DashboardGateway {

  // URL base para las peticiones HTTP
  private urlBase = environment.endpoint;

  // Endpoint específico
  private cardUnoEndpoint: string = 'dashboardCardUno';
  private cardDosEndpoint: string = 'dashboardCardDos';
  private cardTresEndpoint: string = 'dashboardCardTres';
  private cardCuatroEndpoint: string = 'dashboardCardCuatro';
  private cardCincoEndpoint: string = 'dashboardCardCinco';

  /**
    * Constructor del servicio.
    *
    * @param {HttpClient} http - Cliente HTTP para realizar peticiones.
  */
  constructor(
    private http: HttpClient,
  ) { super() }

  override getCardUno(): Observable<DataItemsUno[]> {
    return this.http.get<DataItemsUno[]>(`${this.urlBase}${this.cardUnoEndpoint}`)
  }

  override getCardDos(): Observable<CategoryData[]> {
    return this.http.get<CategoryData[]>(`${this.urlBase}${this.cardDosEndpoint}`)  
  }

  override getCardTres(): Observable<DataItems[]> {
    return this.http.get<DataItems[]>(`${this.urlBase}${this.cardTresEndpoint}`)

  }

  override getCardCuatro(): Observable<CategoryData[]> {
    return this.http.get<CategoryData[]>(`${this.urlBase}${this.cardCuatroEndpoint}`)
  }

  override getCardCinco(): Observable<DataItems[]> {
    return this.http.get<DataItems[]>(`${this.urlBase}${this.cardCincoEndpoint}`)
  }

}
