// Importaciones principales de RxJS
import { signal } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

// Angular: Importaciones para manejar la navegación, ciclo de vida de componentes y formularios reactivos
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Modelos de Dominio y Casos de Uso
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { PostulacionModel } from '@domain/models/postulacion/postulacion.model';
import { DatosComplementariosModel } from '@domain/models/postulacion/datos-complementarios.model';

// Infrastructure
import { TokenService } from '@infrastructure/common/token.service';

// Servicios
import { ToastService } from '@shared/services/toast.service';
import { TextComponent } from '@shared/atoms/text/text.component';
import { DatosComplementariosPorIdPostulacionUsecase } from '@domain/usecases/datos-complementarios/datos-complementarios-por-id-postulacion.usecase';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-postulacion-info-datos-complementarios',
  standalone: true,
  imports: [ReactiveFormsModule, TextComponent],
  templateUrl: './postulacion-info-datos-complementarios.component.html',
  styleUrls: ['./postulacion-info-datos-complementarios.component.css']
})
export class PostulacionInfoDatosComplementariosComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public informacion!: DatosComplementariosModel;
  public usuario!: UserModel;
  public loading = signal<boolean>(false);

  private destroy$ = new Subject<void>();
  private response$!: Observable<ResponseModel>;

  constructor(
    private _fb: FormBuilder,
    private _token: TokenService,
    private _toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: PostulacionModel,
    private _dialogRef: MatDialogRef<PostulacionInfoDatosComplementariosComponent>,
    private _datosComplementariosService: DatosComplementariosPorIdPostulacionUsecase
  ) {
    // Inicializa el FormGroup con controles vacíos
    this.form = this._fb.group({
      banco: [''],
      telefono: [''],
      tipoSangre: [''],
      numeroCuenta: [''],
    });
  }

  ngOnInit(): void {
    this.usuario = this._token.decryptAndSetUserData();
    this.initDatosComplementarios();
  }

  initDatosComplementarios() {
    this.response$ = this._datosComplementariosService.perform({ id: this.data.id! });

    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        this.informacion = data.body as DatosComplementariosModel;
        console.log(this.informacion);
        this.updateForm();
      },
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    });
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    this._toast.error('Lo sentimos, intente más tarde.');
  }

  // Método para actualizar el formulario reactivo con los datos obtenidos
  private updateForm() {
    this.form.patchValue({
      banco: this.informacion.banco,
      telefono: this.informacion.telefono,
      tipoSangre: this.informacion.tipoSangre,
      numeroCuenta: this.informacion.numeroCuenta,
    });
  }

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
