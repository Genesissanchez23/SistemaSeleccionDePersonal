import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryData } from '@domain/models/dashboard/dashboard.model';
import { DashboardCuatroUsecase } from '@domain/usecases/dashboard/dashboard-card-cuatro.usecase';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-card-modalidad',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './card-modalidad.component.html',
  styleUrl: './card-modalidad.component.css'
})
export class CardModalidadComponent implements OnInit, OnDestroy {

  public list: CategoryData[] = []
  private destroy$ = new Subject<void>()
  private response$!: Observable<CategoryData[]>

  constructor(private _dashboard: DashboardCuatroUsecase) {
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

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
