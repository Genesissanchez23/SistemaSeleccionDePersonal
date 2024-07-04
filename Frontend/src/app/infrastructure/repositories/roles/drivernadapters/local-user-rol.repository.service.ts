// Importación de módulos y clases necesarias
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Importación del entorno de configuración
import { environment } from '@environment/environment';

// Importación de entidades y mapeadores de la infraestructura
import { Respuesta, RolEntity } from '@infrastructure/repositories/roles/entities/rol.entity';

/**
  * Servicio que actúa como repositorio local para la gestión de roles de usuario.
  * Define métodos para obtener los roles de usuario desde una API.
*/
@Injectable({
  providedIn: 'root'
})
export class LocalUserRolesRepositoryService {

  // URL base para las peticiones HTTP
  private urlBase = environment.endpoint;

  // Endpoint específico para obtener los roles
  private rolesEndpoint: string = 'consultarTipos';

  /**
    * Constructor del servicio.
    *
    * @param {HttpClient} http - Cliente HTTP para realizar peticiones.
  */
  constructor(
    private http: HttpClient,
  ) { }

  /**
    * Obtiene la lista de roles de usuario desde la API.
    *
    * @returns {Observable<RolEntity[]>} Observable que emite una respuesta con la lista de roles de usuario.
  */
  roles(): Observable<RolEntity[]> {
    return this.http
      .get<Respuesta>(`${this.urlBase}${this.rolesEndpoint}`)
      .pipe(map((response: Respuesta) => response.resultado))
  }

}
