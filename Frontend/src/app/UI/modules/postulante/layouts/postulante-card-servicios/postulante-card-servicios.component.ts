import { Component } from '@angular/core';

@Component({
  selector: 'app-postulante-card-servicios',
  standalone: true,
  imports: [],
  templateUrl: './postulante-card-servicios.component.html',
  styleUrl: './postulante-card-servicios.component.css'
})
export class PostulanteCardServiciosComponent {

  public card = [
    { 
      'icon': 'pi pi-briefcase', 
      'label': 'Plazas', 
      'text': 'Nuestras plazas laborales están pensadas para crecer juntos', 
      'value': 1560 
    },
    { 
      'icon': 'pi pi-lightbulb', 
      'label': 'Oportunidad', 
      'text': 'Aprovecha nuestras oportunidades de desarrollo profesional y personal.', 
      'value': 1000 
    },
    { 
      'icon': 'pi pi-users', 
      'label': 'Postulantes', 
      'text': 'Muchos postulantes ya han comenzado a trabajar con nosotros, Eres el próximo', 
      'value': 70 
    },
  ]

  public getClass(index: number): string {
    if (index === 1) {
      return 'col-12 d-none d-md-block col-md-6 col-lg-4 d-flex justify-content-center';
    } else if (index === 2) {
      return 'col-12 d-none d-lg-block col-md-6 col-lg-4 d-flex justify-content-center';
    }
    return 'col-12 col-md-6 col-lg-4 d-flex justify-content-center';
  }

}
