// Importaciones de RxJS y Angular
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

// Importaciones de Material Design
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// Modelos de Dominio y Casos de Uso
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';
import { PermisoTipoModel } from '@domain/models/permisos/permiso-tipo.model';
import { PermisoListaTiposUsecase } from '@domain/usecases/permisos/permiso-lista-tipos.usecase';

// Componentes
import { TitleComponent } from '@UI/shared/atoms/title/title.component';

@Component({
  selector: 'app-empleado-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleComponent
  ],
  templateUrl: './empleado-details.component.html',
  styleUrl: './empleado-details.component.css'
})
export class EmpleadoDetailsComponent implements OnInit {

  public form!: FormGroup
  public tipos: PermisoTipoModel[] = []
  public permiso!: PermisoSolicitudModel

  constructor(
    private _fb: FormBuilder,
    private _listTipoPermisos: PermisoListaTiposUsecase,
    @Inject(MAT_DIALOG_DATA) public data: PermisoSolicitudModel,
  ) { }

  ngOnInit(): void {
    this.loadTipoSolicitud()
    if (this.data) {
      this.initFrom()
    }
  }

  private initFrom() {
    const fechaInicio = new Date(this.data.fechaInicioPermiso!);
    const fechaFin = new Date(this.data.fechaFinPermiso!);
    
    this.form = this._fb.group({
      permisoTipo: [this.data.permisoTipo],
      descripcion: [this.data.descripcion],
      fechaInicioPermiso: [fechaInicio.toISOString().split('T')[0]],
      fechaFinPermiso: [fechaFin.toISOString().split('T')[0]],
    })
  }

  private loadTipoSolicitud() {
    this._listTipoPermisos.perform().subscribe({
      next: (data) => this.tipos = data.body
    })
  }

}
