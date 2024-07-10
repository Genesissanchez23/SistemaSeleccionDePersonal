import { Component } from '@angular/core';
import { NgxChartsModule, Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-card-contrato',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './card-contrato.component.html',
  styleUrl: './card-contrato.component.css'
})
export class CardContratoComponent {

  public multi: card[] = [
    {
      "name": "Completo",
      "series": [
        {
          "name": "Plazas Totales",
          "value": 20
        },
        {
          "name": "Plazas Ocupadas",
          "value": 2
        }
      ]
    },

    {
      "name": "Medio Tiempo",
      "series": [
        {
          "name": "Plazas Totales",
          "value": 30
        },
        {
          "name": "Plazas Ocupadas",
          "value": 5
        }
      ]
    },

    {
      "name": "Por Horas",
      "series": [
        {
          "name": "Plazas Totales",
          "value": 50
        },
        {
          "name": "Plazas Ocupadas",
          "value": 40
        }
      ]
    }
  ];

  view: [number, number] = [0, 0];


  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Right;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Contrato';
  showYAxisLabel: boolean = true;
  xAxisLabel = 'Plazas Laborales';

  colorScheme: Color = {
    domain: ['#D95747', '#4377E7', '#5B9761'],
    name: '',
    selectable: false,
    group: ScaleType.Time
  };
  schemeType: ScaleType = ScaleType.Linear;

  constructor() {
    Object.assign(this, { multi: this.multi });
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}

export interface card {
  name: string
  series: serie[]
}

export interface serie {
  name: string
  value: number
}
