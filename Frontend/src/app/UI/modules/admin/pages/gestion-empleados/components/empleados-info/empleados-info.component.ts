import { TitleComponent } from '@UI/shared/atoms/title/title.component';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserModel } from '@domain/models/user/user.model';

@Component({
  selector: 'app-empleados-info',
  standalone: true,
  imports: [
    TitleComponent
  ],
  templateUrl: './empleados-info.component.html',
  styleUrl: './empleados-info.component.css'
})
export class EmpleadosInfoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserModel,
  ) { }

  
}
