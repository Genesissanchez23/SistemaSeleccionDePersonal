import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MatDialog } from '@angular/material/dialog';

//Domain
import { UserModel } from '@domain/models/user/user.model';
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';
import { PermisoListaSolicitudesUsuarioUsecase } from '@domain/usecases/permisos/permiso-lista-solicitudes-usuario.usecase';

//Infrastructure
import { TokenService } from '@infrastructure/common/token.service';

//Services
import { ToastService } from '@shared/services/toast.service';
import { ResponseModel } from '@domain/common/response-model';

//UI
import { EmpleadoFormEditComponent } from '../../components/empleado-form-edit/empleado-form-edit.component';
import { EmpleadoDetailsComponent } from '../../components/empleado-details/empleado-details.component';

@Component({
  selector: 'app-empleado-historial',
  standalone: true,
  imports: [
    TableModule,
    CommonModule
  ],
  templateUrl: './empleado-historial.component.html',
  styleUrl: './empleado-historial.component.css'
})
export class EmpleadoHistorialComponent implements OnInit {

  public user!: UserModel
  public loading: boolean = false;
  public list!: PermisoSolicitudModel[];

  constructor(
    private dialog: MatDialog,
    private toast: ToastService,
    private _token: TokenService,
    private _listSolicitudes: PermisoListaSolicitudesUsuarioUsecase
  ) { }

  ngOnInit(): void {
    this.user = this._token.decryptAndSetUserData(),
    this.loadSolicitudes()
  }

  private loadSolicitudes() {
    this.loading = true;
    this._listSolicitudes.perform({id: this.user.id!}).subscribe({
      next: (data) => {
        this.list = data.body.reverse();
        this.loading = false;
      }
    });
    this.loading = false;
  }

  openInfo(data: PermisoSolicitudModel){
    this.dialog.open(EmpleadoDetailsComponent, {
      autoFocus: false,
      disableClose: false,
      width: '460px',
      data: data
    })
  }

  openEditar(data: PermisoSolicitudModel){
    this.dialog.open(EmpleadoFormEditComponent, {
      autoFocus: false,
      disableClose: false,
      width: '460px',
      data: data
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }

  private toastClose(respuesta: ResponseModel): void {
    if (respuesta == undefined) return
    if (!respuesta.status) return
    if (respuesta.status) {
      this.loadSolicitudes()
      this.toast.success(respuesta.body);
    } else {
      this.toast.error(respuesta.body);
    }
  }
  
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

}
