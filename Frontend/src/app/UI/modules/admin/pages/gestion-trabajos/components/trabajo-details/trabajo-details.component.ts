// Importaciones de Angular
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

// Importaciones de Material Design
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// Modelos de Dominio
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';

// UI
import { TitleComponent } from '@UI/shared/atoms/title/title.component';

@Component({
  selector: 'app-trabajo-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleComponent
  ],
  templateUrl: './trabajo-details.component.html',
  styleUrl: './trabajo-details.component.css'
})
export class TrabajoDetailsComponent {

  public form!: FormGroup

  constructor(
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: TrabajoModel,
  ) { }

  ngOnInit(): void {
    this.initFrom()
  }

  private initFrom() {
    this.form = this._fb.group({
      titulo: [this.data.titulo],
      descripcion: [this.data.descripcion],
      cupos: [this.data.cupos],
      modalidad: [this.data.modalidad],
      contrato: [this.data.contrato],
    })
  }

}
