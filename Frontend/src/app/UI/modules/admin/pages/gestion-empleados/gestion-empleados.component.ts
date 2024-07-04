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
import { UserListaUsecase } from '@domain/usecases/user/user-lista-usecase';

//Services
import { ToastService } from '@shared/services/toast.service';

// Components
import { EmpleadosFormComponent } from '@UI/modules/admin/pages/gestion-empleados/components/empleados-form/empleados-form.component';
import { EmpleadosInfoComponent } from '@UI/modules/admin/pages/gestion-empleados/components/empleados-info/empleados-info.component';

@Component({
  selector: 'app-gestion-empleados',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './gestion-empleados.component.html', 
  styleUrl: './gestion-empleados.component.css'
})
export class GestionEmpleadosComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['nombres', 'apellidos', 'cedula', 'usuario', 'acciones'];
  dataSource = new MatTableDataSource<UserModel>();

  public loading = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _dialog: MatDialog,
    private _toast: ToastService,
    private _listEmpleados: UserListaUsecase
  ) { }

  ngOnInit(): void {
    this.loadUsers()
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

  // Cargar usuarios desde el servicio
  private loadUsers() {
    this.loading.update(() => true)
    this.response$ = this._listEmpleados.perform()
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

  // Abrir diálogo para agregar un nuevo empleado
  openAgregar() {
    this._dialog.open(EmpleadosFormComponent, {
      autoFocus: false,
      disableClose: false,
      width: '560px'
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }

  // Abrir diálogo para ver modifica un empleado existente
  openModificar(data: UserModel) {
    this._dialog.open(EmpleadosFormComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: '560px'
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }

  // Abrir diálogo para ver detalles del empleado
  openInformacion(data: UserModel) {
    this._dialog.open(EmpleadosInfoComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: 'auto'
    })
  }

  // Manejar acción después del cierre del diálogo
  private toastClose(respuesta: ResponseModel): void {
    if (respuesta == undefined) return
    if (!respuesta.status) return
    if (respuesta.status) {
      this.loadUsers()
      this._toast.success(respuesta.body);
    } else {
      this._toast.error(respuesta.body);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
