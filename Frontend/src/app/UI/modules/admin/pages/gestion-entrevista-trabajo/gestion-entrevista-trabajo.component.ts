import { Component, OnInit } from '@angular/core';

// Importaciones de Material Design
import { MatDialog } from '@angular/material/dialog';

import { CuestionariosComponent } from './components/cuestionarios/cuestionarios.component';
import { ResponseModel } from '@domain/common/response-model';
import { ToastService } from '@UI/shared/services/toast.service';

@Component({
  selector: 'app-gestion-entrevista-trabajo',
  standalone: true,
  imports: [],
  templateUrl: './gestion-entrevista-trabajo.component.html',
  styleUrl: './gestion-entrevista-trabajo.component.css'
})
export class GestionEntrevistaTrabajoComponent {

  constructor(
    private _dialog: MatDialog,
    private _toast: ToastService,
  ) { }

  // Abrir diálogo para el primer cuestionario
  openCuestionarioUno(isFirstCuestionario: boolean) {
    this._dialog.open(CuestionariosComponent, {
      autoFocus: false,
      disableClose: true,
      width: '560px',
      data: { isFirstCuestionario }
    }).afterClosed().subscribe((respuesta: ResponseModel) => this.toastClose(respuesta))
  }

   // Manejar acción después del cierre del diálogo
   private toastClose(respuesta: ResponseModel): void {
    if (respuesta == undefined) return
    if (!respuesta.status) return
    if (respuesta.status) {
      this._toast.success(respuesta.body);
    } else {
      this._toast.error(respuesta.body);
    }
  }

}
