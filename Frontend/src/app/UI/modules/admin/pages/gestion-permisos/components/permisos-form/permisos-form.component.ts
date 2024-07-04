// Importaciones de RxJS y Angular
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Importaciones de Material Design
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

// Modelos de Dominio y Casos de Uso
import { ResponseModel } from '@domain/common/response-model';
import { PermisoTipoModel } from '@domain/models/permisos/permiso-tipo.model';
import { PermisoListaTiposUsecase } from '@domain/usecases/permisos/permiso-lista-tipos.usecase';
import { PermisoRegistrarTipoUsecase } from '@domain/usecases/permisos/permiso-registrar-tipo.usecase';

// Services
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-permisos-form',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatProgressBarModule,
  ],
  templateUrl: './permisos-form.component.html',
  styleUrl: './permisos-form.component.css'
})
export class PermisosFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['tipo', 'fechaIng'];
  dataSource = new MatTableDataSource<PermisoTipoModel>();

  public form!: FormGroup
  public loading = signal<boolean>(false)
  public loadingBtn = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _tipoRegistrar: PermisoRegistrarTipoUsecase,
    private _listTipoPermisos: PermisoListaTiposUsecase
  ) {
    this.form = this._fb.group({
      tipo: ['', [Validators.required, Validators.maxLength(50)]],
    })
  }

  ngOnInit(): void {
    this.loadTipoSolicitud()
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

  // Cargar de tipos de solicitudes desde el servicio
  private loadTipoSolicitud() {
    this.loading.update(() => true)
    this.response$ = this._listTipoPermisos.perform()
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.dataSource.data = data.body.reverse(),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })
  }

  // Maneja el envío del formulario de registro
  onSubmit() {
    if (this.handleFieldMaxLengthError(this.tipo, 'Tipo')) {
      return;
    }
    
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._toast.error('Ingrese el tipo')
      return
    }

    const params = {
      tipo: this.tipo.value
    }

    this.loadingBtn.update(() => true)

    this.response$ = this._tipoRegistrar.perform(params);
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        if (data.status) {
          this._toast.success('Ingresado con éxito')
        }
      },
      error: (err) => this.handleError(err),
      complete: () => {
        this.loading.update(() => false)
        this.loadTipoSolicitud()
      }
    })

    this.form.reset()
  }

  // Función para manejar el error de longitud máxima del campo
  private handleFieldMaxLengthError(control: AbstractControl, fieldName: string): boolean {
    if (control.errors?.['maxlength']) {
      control.markAsTouched();
      this._toast.error(`El campo ${fieldName} excede el límite.`);
      return true;
    }
    return false;
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    console.error('Lo sentimos ocurrió un error:', err)
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Getters para acceder fácilmente a los controles del formulario
  get tipo() { return this.form.get('tipo')! }

}
