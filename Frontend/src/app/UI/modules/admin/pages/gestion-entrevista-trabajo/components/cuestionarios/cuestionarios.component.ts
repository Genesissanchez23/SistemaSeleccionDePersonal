// Angular
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Material
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResponseModel } from '@domain/common/response-model';
import { PostulacionModel } from '@domain/models/postulacion/postulacion.model';
import { PostulacionListaUsecase } from '@domain/usecases/postulacion/postulacion-lista.usecase';
import { PostulacionRegistrarCuestioanrioEntrevistaUseCase } from '@domain/usecases/postulacion/postulacion-registrar-cuestionario-entrevista.usecase';

// Infrastructura
import { LocalCuestionariosService } from '@infrastructure/repositories/custionarios/drivernadapters/local-cuestionarios.service';
import { Blocks, Cuestionario, Questions } from '@infrastructure/repositories/custionarios/entities/cuestionario-uno-bloque-uno';

// UI
import { ToastService } from '@UI/shared/services/toast.service';

@Component({
  selector: 'app-cuestionarios',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './cuestionarios.component.html',
  styleUrl: './cuestionarios.component.css'
})
export class CuestionariosComponent implements OnInit {

  public form!: FormGroup
  public formPostulante!: FormGroup
  public currentDate!: string;
  public cuestionario!: Cuestionario
  public loading = signal<boolean>(false)
  public loadingBtn = signal<boolean>(false)
  public postulaciones!: PostulacionModel[]

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel>

  constructor(
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _cuestionarios: LocalCuestionariosService,
    private _listaPostulacion: PostulacionListaUsecase,
    private _registrarCuestionario: PostulacionRegistrarCuestioanrioEntrevistaUseCase,
    private _dialogRef: MatDialogRef<CuestionariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isFirstCuestionario: boolean },
  ) {
    this.formPostulante = this._fb.group({
      postulante: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    const date = new Date();
    this.currentDate = date.toLocaleDateString();
    this.loadPostulaciones();
    this.loadCuestionario()
    this.form = this._fb.group({});
  }

  loadPostulaciones() {
    this.loading.update(() => true)
    this.response$ = this._listaPostulacion.perform()
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        const lista: PostulacionModel[] = data.body
        this.postulaciones = lista.filter(elemento => elemento.estadoChar == 'P')
      },
      error: () => this.loading.update(() => false),
      complete: () => this.loading.update(() => false)
    })
  }

  loadCuestionario() {
    const cuestionarioMethod = this.data.isFirstCuestionario
      ? this._cuestionarios.loadQuestionsBloqueUno()
      : this._cuestionarios.loadQuestionsBloqueDos();

    cuestionarioMethod.subscribe({
      next: (data: Cuestionario) => {
        this.cuestionario = data;
        this.form = this._fb.group({});
        this.cuestionario.blocks.forEach((block: Blocks, blockIndex: number) => {
          block.questions.forEach((question: Questions, questionIndex: number) => {
            const controlName = `bloque-${blockIndex}-pregunta-${questionIndex}`;
            this.form.addControl(controlName, this._fb.control('', Validators.required));
          });
        });
      }
    });
  }

  onSubmit() {
    console.log(this.postulante.value);
    
    if (this.formPostulante.invalid) {
      this._toast.error('Seleccione un postulante')
      return
    }

    if (this.form.invalid) {
      this._toast.error('Faltan preguntas por contestar')
      return
    }

    const selectedOptions = JSON.stringify(this.buildSelectedOptionsJson());
    
    this.loadingBtn.update(() => true)
    this.response$ = this._registrarCuestionario.perform({idPostulacion: this.postulante.value, cuestionario: selectedOptions})
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel) => {
        data.body = data.status ? 'Cuestionario Registrado con éxito' : 'Hubo un problema, intente luego.'
        this._dialogRef.close(data)
      },
      error: () => this.loadingBtn.update(() => false),
      complete: () => this.loadingBtn.update(() => false)
    })
  }

  buildSelectedOptionsJson(): Cuestionario {
    const selectedCuestionario: Cuestionario = {
      title: this.cuestionario.title,
      blocks: []
    };

    this.cuestionario.blocks.forEach((block: Blocks, blockIndex: number) => {
      const selectedBlock: Blocks = {
        title: block.title,
        questions: []
      };

      block.questions.forEach((question: Questions, questionIndex: number) => {
        const controlName = `bloque-${blockIndex}-pregunta-${questionIndex}`;
        const selectedOption = this.form.get(controlName)?.value;

        const selectedQuestion: Questions = {
          question: question.question,
          options: [selectedOption]
        };

        selectedBlock.questions.push(selectedQuestion);
      });

      selectedCuestionario.blocks.push(selectedBlock);
    });

    return selectedCuestionario;
  }

  onClose() {
    this._dialogRef.close()
  }

  // Getters para acceder fácilmente a los controles del formulario
  get postulante() { return this.formPostulante.get('postulante')! }

}
