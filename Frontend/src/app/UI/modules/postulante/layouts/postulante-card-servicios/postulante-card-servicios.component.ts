import { Component, OnInit } from '@angular/core';
import { ResponseModel } from '@domain/common/response-model';
import { PostulacionModel } from '@domain/models/postulacion/postulacion.model';
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';
import { PostulacionListaUsecase } from '@domain/usecases/postulacion/postulacion-lista.usecase';
import { TrabajoListaUsecase } from '@domain/usecases/trabajo/trabajo-lista.usecase';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-postulante-card-servicios',
  standalone: true,
  imports: [],
  templateUrl: './postulante-card-servicios.component.html',
  styleUrl: './postulante-card-servicios.component.css'
})
export class PostulanteCardServiciosComponent implements OnInit {

  public cantidadPlazas: number = 0;
  public cantidadPostulantes: number = 0;
  private destroy$ = new Subject<void>();
  private response$!: Observable<ResponseModel>;

  constructor(
    private _listTrabajo: TrabajoListaUsecase,
    private _postulantes: PostulacionListaUsecase
  ) { }

  ngOnInit(): void {
    this.load();
  }

  private load() {
    this._listTrabajo.perform().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        const plazas: TrabajoModel[] = data.body;
        this.cantidadPlazas = plazas.length;
        this.updateCard();
      },
    });

    this._postulantes.perform().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        const plazas: PostulacionModel[] = data.body;
        this.cantidadPostulantes = plazas.length;
        this.updateCard();
      },
    });
  }

  public card: any[] = [];

  private updateCard() {
    this.card = [
      { 
        'icon': 'pi pi-briefcase', 
        'label': 'Plazas', 
        'text': 'Nuestras plazas laborales están pensadas para crecer juntos', 
        'value': this.cantidadPlazas 
      },
      { 
        'icon': 'pi pi-lightbulb', 
        'label': 'Oportunidad', 
        'text': 'Aprovecha nuestras oportunidades de desarrollo profesional y personal.', 
        'value': 1000 
      },
      { 
        'icon': 'pi pi-users', 
        'label': 'Postulantes', 
        'text': 'Muchos postulantes ya han comenzado a trabajar con nosotros, Eres el próximo', 
        'value': this.cantidadPostulantes 
      },
    ];
  }

  public getClass(index: number): string {
    if (index === 1) {
      return 'col-12 d-none d-md-block col-md-6 col-lg-4 d-flex justify-content-center';
    } else if (index === 2) {
      return 'col-12 d-none d-lg-block col-md-6 col-lg-4 d-flex justify-content-center';
    }
    return 'col-12 col-md-6 col-lg-4 d-flex justify-content-center';
  }

}
