// Importaciones de RxJS, Router y Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Importaciones de Material Design
import { MatTooltipModule } from '@angular/material/tooltip';

// UI
import { PostulanteCardServiciosComponent } from '@UI/modules/postulante/layouts/postulante-card-servicios/postulante-card-servicios.component';
import { PostulanteNavComponent } from '../../layouts/postulante-nav/postulante-nav.component';
import { SectionPlazasLaboralesComponent } from '../../components/section-plazas-laborales/section-plazas-laborales.component';
import { PostulanteFooterComponent } from '../../layouts/postulante-footer/postulante-footer.component';


@Component({
  selector: 'app-postulante-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTooltipModule,
    PostulanteNavComponent,
    PostulanteFooterComponent,
    PostulanteCardServiciosComponent,
    SectionPlazasLaboralesComponent,
  ],
  templateUrl: './postulante-home.component.html',
  styleUrl: './postulante-home.component.css',
})
export default class PostulanteHomeComponent {


}
