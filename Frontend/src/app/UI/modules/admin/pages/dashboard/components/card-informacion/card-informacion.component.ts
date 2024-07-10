import { Component, HostListener } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-card-informacion',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './card-informacion.component.html',
  styleUrl: './card-informacion.component.css'
})
export class CardInformacionComponent  {

  public single: card[] = [
    { name: 'Plazas Laborales',value: 144002 },
    { name: 'Aspirantes', value: 3424222 },
    { name: 'Empleados', value: 235500 },
    { name: 'Solicitudes', value: 1222421 },
  ]

  view: [number, number] = [0, 0];
  
  colorScheme: Color = {
    domain: ['#D95747', '#5B9761', '#4377E7', '#333333'],    
    name: '',
    selectable: false,
    group: ScaleType.Time
    };
  cardColor: string = '#7CAC81';
  
  constructor() {
    Object.assign(this, { single: this.single });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
  }

}

export interface card {
  name:         string
  value:        number
}