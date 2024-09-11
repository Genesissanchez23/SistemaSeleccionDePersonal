// Importaciones de RxJS y Angular
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';

// Importaciones de Material Design
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

// Modelos de Dominio y Casos de Uso
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';
import { PermisoListaSolicitudesUsuarioUsecase } from '@domain/usecases/permisos/permiso-lista-solicitudes-usuario.usecase';

// Infrastructure
import { TokenService } from '@infrastructure/common/token.service';

// Services
import { ToastService } from '@shared/services/toast.service';

// UI
import { EmpleadoDetailsComponent } from '@UI/modules/empleado/components/empleado-details/empleado-details.component';
import { EmpleadoFormEditComponent } from '@UI/modules/empleado/components/empleado-form-edit/empleado-form-edit.component';

@Component({
  selector: 'app-empleado-historial',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './empleado-historial.component.html',
  styleUrl: './empleado-historial.component.css'
})
export class EmpleadoHistorialComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['tipo', 'fechaRegistro', 'descripcion', 'certificado', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<PermisoSolicitudModel>();

  public user!: UserModel

  public loading = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _dialog: MatDialog,
    private _toast: ToastService,
    private _token: TokenService,
    private _listSolicitudes: PermisoListaSolicitudesUsuarioUsecase
  ) { }

  ngOnInit(): void {
    this.user = this._token.decryptAndSetUserData(),
      this.loadSolicitudes()
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

  private loadSolicitudes() {
    this.loading.update(() => true)
    this.response$ = this._listSolicitudes.perform({ id: this.user.id! })
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.dataSource.data = data.body.reverse(),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    console.error('Error al momento de listar los permisos:', err)
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  // Abrir diálogo para ver detalles de una solicitud de permiso
  openInfo(data: PermisoSolicitudModel) {
    this._dialog.open(EmpleadoDetailsComponent, {
      autoFocus: false,
      disableClose: false,
      width: '460px',
      data: data
    })
  }

  // Abrir diálogo para ver modifica una solicitud de permiso
  openEditar(data: PermisoSolicitudModel) {
    this._dialog.open(EmpleadoFormEditComponent, {
      autoFocus: false,
      disableClose: false,
      width: '460px',
      data: data
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }

  // Manejar acción después del cierre del diálogo
  private toastClose(respuesta: ResponseModel): void {
    if (respuesta == undefined) return
    if (!respuesta.status) return
    if (respuesta.status) {
      this.loadSolicitudes()
      this._toast.success(respuesta.body);
    } else {
      this._toast.error(respuesta.body);
    }
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

  // Obtener la clase CSS según el estado del permiso
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'A':
        return ' bg-blue-custom';
      case 'E':
        return 'bg-black-custom';
      case 'D':
        return 'bg-orange-custom';
      default:
        return ' text-bg-secondary';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
