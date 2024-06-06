import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

//Domain
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { PermisoSolicitudModel } from '@domain/models/permisos/permiso-solicitud.model';
import { PermisoListaSolicitudesUsecase } from '@domain/usecases/permisos/permiso-lista-solicitudes.usecase';

//Services
import { ToastService } from '@shared/services/toast.service';

//Components
import { PermisosFormComponent } from './components/permisos-form/permisos-form.component';

@Component({
  selector: 'app-gestion-permisos',
  standalone: true,
  imports: [
    TableModule,
    CommonModule
  ],
  templateUrl: './gestion-permisos.component.html',
  styleUrl: './gestion-permisos.component.css'
})
export class GestionPermisosComponent implements OnInit {

  public list!: PermisoSolicitudModel[];
  public loading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private toast: ToastService,
    private _listSolicitudes: PermisoListaSolicitudesUsecase
  ) { }

  ngOnInit(): void {
    this.loadSolicitudes()
  }

  private loadSolicitudes() {
    this.loading = true;
    this._listSolicitudes.perform().subscribe({
      next: (data) => {
        this.list = data.body;
        this.loading = false;
      }
    });
    this.loading = false;
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

  openAgregar() {
    this.dialog.open(PermisosFormComponent, {
      autoFocus: false,
      disableClose: false,
      width: '560px'
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta));
  }

  openAceptar() {
  }

  openRechazar() {
  }

  private toastClose(respuesta: ResponseModel): void {
    if (respuesta == undefined) return;
    if (!respuesta.status) return;
    if (respuesta.status) {
      this.loadSolicitudes();
      this.toast.success(respuesta.body);
    } else {
      this.toast.error(respuesta.body);
    }
  }

}
