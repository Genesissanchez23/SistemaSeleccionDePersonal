import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxChartsModule, Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';

import { CategoryData } from '@domain/models/dashboard/dashboard.model';
import { DashboardDosUsecase } from '@domain/usecases/dashboard/dashboard-card-dos.usecase';

@Component({
  selector: 'app-card-contrato',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './card-contrato.component.html',
  styleUrl: './card-contrato.component.css'
})
export class CardContratoComponent implements OnInit, OnDestroy {

  public list: CategoryData[] = []
  private destroy$ = new Subject<void>()
  private response$!: Observable<CategoryData[]>

  constructor(private _dashboard: DashboardDosUsecase) {
    Object.assign(this, { multi: this.list });
  }

  ngOnInit(): void {
    this.loadInfo()
  }

  private loadInfo() {
    this.response$ = this._dashboard.perform()
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: CategoryData[]) => this.list = data
    })
  }

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

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
  
}
