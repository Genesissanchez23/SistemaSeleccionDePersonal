// Importaciones de RxJS y Angular
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';

// Importaciones de Material Design
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

// Modelos de Dominio y Casos de Uso
import { ResponseModel } from '@domain/common/response-model';
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';
import { PostulacionModel } from '@domain/models/postulacion/postulacion.model';
import { PostulacionListaPorPlazaLaboralUsecase } from '@domain/usecases/postulacion/postulacion-lista-por-plazalaboral.usecase';

// Servicios
import { ToastService } from '@shared/services/toast.service';

// Componentes
import { PostulacionAceptarComponent } from '../postulacion-aceptar/postulacion-aceptar.component';
import { PostulacionRechazarComponent } from '../postulacion-rechazar/postulacion-rechazar.component';
import { PostulacionSolicitarDatosComponent } from '../postulacion-solicitar-datos/postulacion-solicitar-datos.component';
import { PostulacionInfoDatosComplementariosComponent } from '../postulacion-info-datos-complementarios/postulacion-info-datos-complementarios.component';
import { PostulacionCuestionarioComponent } from '../postulacion-cuestionario/postulacion-cuestionario.component';

// Components

@Component({
  selector: 'app-postulantes-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './postulantes-list.component.html',
  styleUrl: './postulantes-list.component.css'
})
export class PostulantesListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['aspiranteNombres', 'aspiranteApellidos', 'estadoNombre', 'curriculum', 'entrevista', 'Datos Complementarios', 'Aceptar Postulación', 'Solicitar Datos Personales', 'Eliminar Proceso'];
  dataSource = new MatTableDataSource<PostulacionModel>();

  public loading = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _dialog: MatDialog,
    private _toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: TrabajoModel,
    private _dialogRef: MatDialogRef<PostulantesListComponent>,
    private _listPostulantes: PostulacionListaPorPlazaLaboralUsecase,
  ) { }

  ngOnInit(): void {
    this.loadPostulantes()
  }

  // Configuración después de que la vista se ha inicializado completamente
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.dataSource.data.length > 0) {
      this.paginator._intl.itemsPerPageLabel = "Items por Página ";
    }
  }

  // Aplicar filtro a los datos de la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Cargar las solicitudes desde el servicio
  private loadPostulantes() {
    this.loading.update(() => true)
    this.response$ = this._listPostulantes.perform({ id: this.data.id! })
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        const list = data.body as PostulacionModel[]
        if (list.length < 1) {
          this._toast.error('No hay postulaciones en la plaza laboral')
          this._dialogRef.close()
          return
        }
        this.dataSource.data = data.body as PostulacionModel[]
      },
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  // Abrir diálogo para ver datos adicionales
  openDatosAdicionales(data: PostulacionModel) {
    this._dialog.open(PostulacionInfoDatosComplementariosComponent, {
      autoFocus: false,
      disableClose: false,
      width: '400px',
      data: data
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta));
  }

  // Abrir diálogo para asignar la fecha de la entrevista
  openAsignarFecha(data: PostulacionModel) {
    this._dialog.open(PostulacionAceptarComponent, {
      autoFocus: false,
      disableClose: false,
      width: '400px',
      data: data
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta));
  }

  // Abrir diálogo para asignar la fecha de la entrevista
  openSolictarDatos(data: PostulacionModel) {
    this._dialog.open(PostulacionSolicitarDatosComponent, {
      autoFocus: false,
      disableClose: false,
      width: 'auto',
      data: data
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta));
  }

  // Abrir diálogo para aceptar solicitud de permiso
  openRechazar(data: PostulacionModel) {
    this._dialog.open(PostulacionRechazarComponent, {
      autoFocus: false,
      disableClose: false,
      width: 'auto',
      data: data
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta));
  }

  openCuestionario(data: PostulacionModel){
    this._dialog.open(PostulacionCuestionarioComponent, {
      autoFocus: false,
      disableClose: false,
      width: '600px',
      data: data
    })
  }

  downloadPDF(base64String: string, fileName: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(blobUrl);
  }

  // Manejar acción después del cierre del diálogo
  private toastClose(respuesta: ResponseModel): void {
    if (respuesta == undefined) return;
    if (!respuesta.status) return;
    if (respuesta.status) {
      this.loadPostulantes();
      this._toast.success(respuesta.body);
    } else {
      this._toast.error(respuesta.body);
    }
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    console.error('Error al momento de listar los permisos:', err)
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
