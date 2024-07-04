import { Component } from '@angular/core';

export interface image {
  id: number
  url: string
}

@Component({
  selector: 'app-postulante-carousel',
  standalone: true,
  imports: [],
  templateUrl: './postulante-carousel.component.html',
  styleUrl: './postulante-carousel.component.css'
})
export class PostulanteCarouselComponent {

  images: image[] = [
    { id: 1, url: 'banner-1.png' },
    { id: 2, url: 'banner-2.png' },
    { id: 3, url: 'banner-3.png' },
    { id: 4, url: 'banner-4.png' }
  ]

}
