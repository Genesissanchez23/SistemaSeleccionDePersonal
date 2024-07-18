// Importaciones de RxJS y Angular
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Component, signal } from '@angular/core';

// Importaciones de Material Design
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Modelos de Dominio y Casos de Uso
import { ResponseModel } from '@domain/common/response-model';
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';
import { TrabajoListaUsecase } from '@domain/usecases/trabajo/trabajo-lista.usecase';

//Services
import { ToastService } from '@shared/services/toast.service';
import { TitleComponent } from '@UI/shared/atoms/title/title.component';
import { PostulantesListComponent } from './components/postulantes-list/postulantes-list.component';

@Component({
  selector: 'app-gestion-postulaciones',
  standalone: true,
  imports: [
    MatProgressBarModule,
    TitleComponent
  ],
  templateUrl: './gestion-postulaciones.component.html',
  styleUrl: './gestion-postulaciones.component.css'
})
export class GestionPostulacionesComponent {

  public loading = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  public listPlazas: TrabajoModel[] = [];
  private originalListPlazas: TrabajoModel[] = [];
  
  constructor(    
    private _dialog: MatDialog,
    private _toast: ToastService,
    private _listTrabajo: TrabajoListaUsecase
  ) { }

  ngOnInit(): void {
    this.loadPlazasLaborales()
  }

  private loadPlazasLaborales() {
    this.loading.update(() => true)
    this.response$ = this._listTrabajo.perform()
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        this.originalListPlazas = data.body;
        this.listPlazas = data.body;
      },
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  
  // Aplicar filtro a los datos
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (filterValue) {
      this.listPlazas = this.originalListPlazas.filter(item =>
        item.titulo?.toLowerCase().includes(filterValue) ||
        item.modalidad?.toLowerCase().includes(filterValue)
      );
    } else {
      this.listPlazas = this.originalListPlazas; // Restablecer la lista original si el filtro está vacío
    }
  }

  // Abrir diálogo para agregar nuevo permiso
  openPostulantes(data: TrabajoModel) {
    this._dialog.open(PostulantesListComponent, {
      autoFocus: false,
      disableClose: false,
      width: 'auto',
      data: data
    })
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
