import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//Domain
import { PermisoTipoModel } from '@domain/models/permisos/permiso-tipo.model';
import { ResponseModel } from '@domain/common/response-model';
import { PermisoRegistrarTipoUsecase } from '@domain/usecases/permisos/permiso-registrar-tipo.usecase';
import { PermisoListaTiposUsecase } from '@domain/usecases/permisos/permiso-lista-tipos.usecase';

//Services
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-permisos-form',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './permisos-form.component.html',
  styleUrl: './permisos-form.component.css'
})
export class PermisosFormComponent implements OnInit {

  public list!: PermisoTipoModel[]
  public loading: boolean = false
  public loadingBtn = false
  public form!: FormGroup
  private response$!: Observable<ResponseModel>;
  private subscription: Subscription = new Subscription();

  constructor(
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _tipoRegistrar: PermisoRegistrarTipoUsecase,
    private _listTipoPermisos: PermisoListaTiposUsecase
  ) {
    this.form = this._fb.group({
      tipo: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.loadTipoSolicitud()
  }

  private loadTipoSolicitud(){
    this.loading = true
    this._listTipoPermisos.perform().subscribe({
      next: (data) => {
        this.list = data.body
        this.loading = false
      }
    })
    this.loading = false
  }

  onSubmit(){
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this._toast.error('Ingrese el tipo')
      return
    }
    
    const params = {
      tipo: this.tipo.value
    }

    this.loadingBtn = true
    this.response$ = this._tipoRegistrar.perform(params)
    this.subscription.add(
      this.response$.subscribe({
        next: (data) => {        
          if(data.status){          
            this._toast.success('Ingresado con éxito')
          }
        },
        error: () => this._toast.error('Ha ocurrido un error'),
        complete: () => {        
          this.loading = false
          this.loadTipoSolicitud()
        }
      })
    )
    this.form.reset()
  }

  get tipo() { return this.form.get('tipo')! }

}
