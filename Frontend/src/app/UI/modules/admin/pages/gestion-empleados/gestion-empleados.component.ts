import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableModule } from 'primeng/table';

//Domain
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { UserListaUsecase } from '@domain/usecases/user/user-lista-usecase';

//Services
import { ToastService } from '@shared/services/toast.service';

//Components
import { EmpleadosFormComponent } from './components/empleados-form/empleados-form.component';
import { EmpleadosInfoComponent } from './components/empleados-info/empleados-info.component';

@Component({
  selector: 'app-gestion-empleados',
  standalone: true,
  imports: [
    TableModule,
    MatDialogModule
  ],
  templateUrl: './gestion-empleados.component.html',
  styleUrl: './gestion-empleados.component.css'
})
export class GestionEmpleadosComponent implements OnInit {

  public list!: UserModel[]
  public loading: boolean = false

  constructor(
    private dialog: MatDialog,
    private toast: ToastService,
    private _listEmpleados: UserListaUsecase
  ) { }

  ngOnInit(): void {
    this.loadUsers()
  }

  private loadUsers() {
    this.loading = true;
    this._listEmpleados.perform().subscribe({
      next: (data) => {
        this.list = data.body.reverse()
        this.loading = false
      }
    })
  }

  openAgregar() {
    this.dialog.open(EmpleadosFormComponent, {
      autoFocus: false,
      disableClose: false,
      width: '560px'
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }

  openModificar(data: UserModel) {
    this.dialog.open(EmpleadosFormComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: '560px'
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }

  openInformacion(data: UserModel){
    this.dialog.open(EmpleadosInfoComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: '450px'
    })
  }

  private toastClose(respuesta: ResponseModel): void {
    if (respuesta == undefined) return
    if (!respuesta.status) return
    if (respuesta.status) {
      this.loadUsers()
      this.toast.success(respuesta.body);
    } else {
      this.toast.error(respuesta.body);
    }
  }

}
