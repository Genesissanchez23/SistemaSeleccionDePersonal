import { Component } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-card-modalidad',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './card-modalidad.component.html',
  styleUrl: './card-modalidad.component.css'
})
export class CardModalidadComponent {

  multi = [
    {
      "name": "Presencial",
      "series": [
        {
          "name": "Plazas Ocupadas",
          "value": 20
        },
        {
          "name": "Plazas Laborales",
          "value": 5
        },
      ]
    },

    {
      "name": "Virtual",
      "series": [
        {
          "name": "Plazas Ocupadas",
          "value": 24
        },
        {
          "name": "Plazas Laborales",
          "value": 15
        },
      ]
    },

    {
      "name": "Híbrido",
      "series": [
        {
          "name": "Plazas Ocupadas",
          "value": 11
        },
        {
          "name": "Plazas Laborales",
          "value": 10
        },
      ]
    }
  ];

  view: [number, number] = [0, 0];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Plazas Laborales';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Modalidad';
  animations: boolean = true;

  colorScheme: Color = {
    domain: ['#D95747', '#5B9761', '#4377E7'],
    name: '',
    selectable: false,
    group: ScaleType.Time
  };

  constructor() {
    Object.assign(this, { multi: this.multi });
  }

  onSelect(event: Event) {
    console.log(event);
  }

}
