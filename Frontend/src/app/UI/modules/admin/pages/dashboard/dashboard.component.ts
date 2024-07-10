import { Component } from '@angular/core';
import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CardInformacionComponent } from './components/card-informacion/card-informacion.component';
import { CardContratoComponent } from './components/card-contrato/card-contrato.component';
import { CardHeaderComponent } from './components/card-header/card-header.component';
import { CardModalidadComponent } from './components/card-modalidad/card-modalidad.component';
import { CardPermisosComponent } from './components/card-permisos/card-permisos.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    NgComponentOutlet,
    CardHeaderComponent,
    CardInformacionComponent,
    CardContratoComponent,
    CardModalidadComponent,
    CardPermisosComponent
  ]
})
export class DashboardComponent {

}
