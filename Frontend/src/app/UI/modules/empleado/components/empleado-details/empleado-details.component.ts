import { TitleComponent } from '@UI/shared/atoms/title/title.component';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

//Domain
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';
import { PermisoTipoModel } from '@domain/models/permisos/permiso-tipo.model';
import { PermisoListaTiposUsecase } from '@domain/usecases/permisos/permiso-lista-tipos.usecase';

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
    this.initFrom()
    if (this.data) {
      this.initFromEdit(this.data)
    }
  }

  private initFrom() {
    this.form = this._fb.group({
      permisoTipo: [''],
      descripcion: [''],
      fechaInicioPermiso: [''],
      fechaFinPermiso: [''],
    })
  }

  private initFromEdit(data: PermisoSolicitudModel) {
    const fechaInicio = new Date(data.fechaInicioPermiso!);
    const fechaFin = new Date(data.fechaFinPermiso!);
    this.form.patchValue({
      permisoTipo: data.permisoTipo,
      descripcion: data.descripcion,
      fechaInicioPermiso: fechaInicio.toISOString().split('T')[0],
      fechaFinPermiso: fechaFin.toISOString().split('T')[0],
    });
  }

  private loadTipoSolicitud() {
    this._listTipoPermisos.perform().subscribe({
      next: (data) => this.tipos = data.body
    })
  }


}
