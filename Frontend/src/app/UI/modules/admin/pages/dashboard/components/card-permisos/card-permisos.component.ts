import { Component } from '@angular/core';
import { NgxChartsModule, Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-card-permisos',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './card-permisos.component.html',
  styleUrl: './card-permisos.component.css'
})
export class CardPermisosComponent {
  single = [
    {
      "name": "Permisos Aceptados",
      "value": 23
    },
    {
      "name": "Permisos Rechazados",
      "value": 10
    },
    {
      "name": "Permisos Pendientes",
      "value": 25
    }
  ];

  view: [number, number] = [0, 0];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Below;

  colorScheme: Color = {
    domain: ['#D95747', '#4377E7', '#5B9761'],
    name: '',
    selectable: false,
    group: ScaleType.Time
  };

  constructor() {
    Object.assign(this, { single: this.single });
  }

  onSelect(data: Event): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: Event): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: Event): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
