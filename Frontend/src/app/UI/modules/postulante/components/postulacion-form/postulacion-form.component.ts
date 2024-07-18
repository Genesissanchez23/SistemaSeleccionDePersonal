// Importaciones de RxJS y Angular
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Importaciones de Material Design
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Importaciones de dominio
import { UserModel } from '@domain/models/user/user.model';
import { ResponseModel } from '@domain/common/response-model';
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';
import { PostulacionRegistrarUsecase } from '@domain/usecases/postulacion/postulacion-registrar.usecase';

// Importaciones de infrastructura
import { TokenService } from '@infrastructure/common/token.service';

// Servicies
import { ToastService } from '@shared/services/toast.service';
import { PostulacionModel } from '@domain/models/postulacion/postulacion.model';

@Component({
  selector: 'app-postulacion-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './postulacion-form.component.html',
  styleUrl: './postulacion-form.component.css'
})
export class PostulacionFormComponent implements OnInit, OnDestroy {

  public form!: FormGroup
  public loading = signal<boolean>(false)
  private usuario!: UserModel
  private fileCV!: File;

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _fb: FormBuilder,
    private token: TokenService,
    private _toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: TrabajoModel,
    private _dialogRef: MatDialogRef<PostulacionFormComponent>,
    private _registrarPostulaciones: PostulacionRegistrarUsecase,
  ) { }


  ngOnInit(): void {
    this.initFrom()
    this.usuario = this.token.decryptAndSetUserData()
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] as File

    // Límite de tamaño en bytes (5 MB)
    const sizeLimit = 5 * 1024 * 1024;

    if (file.size > sizeLimit) {
      this.cv.setValue(null)
      this._toast.error('El archivo no debe pesar más de 5 MB.');
      return;
    }

    this.fileCV = file
  }

  onSubmit() {

    if (this.cv.invalid) {
      this._toast.error('Por favor cargue su curriculum.')
      return
    }

    if (this.terminos.value == false) {
      this._toast.error('Acepte terminos y condiciones.')
      return
    }

    const postulacion: PostulacionModel = {
      aspiranteId: this.usuario.id,
      plazaLaboralId: this.data.id,
      curriculum: this.fileCV
    }

    this.loading.update(() => true)

    this.response$ = this._registrarPostulaciones.perform(postulacion)

    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => this.handleSuccess(data),
      error: (err) => this.handleError(err),
      complete: () => this.loading.update(() => false)
    })

  }

  // Maneja el éxito de la respuesta de login
  private handleSuccess(data: ResponseModel) {
    this.form.reset()
    this._dialogRef.close(data)
  }

  // Maneja el error de la respuesta
  private handleError(err: any) {
    this.loading.update(() => false)
    this._dialogRef.close()
    this._toast.error('Lo sentimos, intente mas luego.')
  }

  // Metodo para inicializar el formulario reactivo
  private initFrom() {
    this.form = this._fb.group({
      cv: ['', Validators.required],
      terminos: ['', Validators.required]
    })
  }

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Getters para acceder fácilmente a los controles del formulario
  get cv() { return this.form.get('cv')! }
  get terminos() { return this.form.get('terminos')! }

}
