import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PostulanteCarouselComponent } from '../../layouts/postulante-carousel/postulante-carousel.component';

@Component({
  selector: 'app-postulante-home',
  standalone: true,
  imports: [
    CommonModule,
    PostulanteCarouselComponent
  ],
  templateUrl: './postulante-home.component.html',
  styleUrl: './postulante-home.component.css',
})
export default class PostulanteHomeComponent {

}
