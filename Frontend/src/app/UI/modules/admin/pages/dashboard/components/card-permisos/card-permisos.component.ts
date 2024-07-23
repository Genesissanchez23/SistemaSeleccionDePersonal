import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataItems } from '@domain/models/dashboard/dashboard.model';
import { DashboardCincoUsecase } from '@domain/usecases/dashboard/dashboard-card-cinco.usecase';
import { NgxChartsModule, Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-card-permisos',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './card-permisos.component.html',
  styleUrl: './card-permisos.component.css'
})
export class CardPermisosComponent implements OnInit, OnDestroy {

  public list: DataItems[] = []
  private destroy$ = new Subject<void>()
  private response$!: Observable<DataItems[]>

  constructor(private _dashboard: DashboardCincoUsecase) {
    Object.assign(this, { multi: this.list });
  }

  ngOnInit(): void {
    this.loadInfo()
  }

  private loadInfo() {
    this.response$ = this._dashboard.perform()
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: DataItems[]) => this.list = data
    })
  }

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

  // Método de ciclo de vida de Angular: Se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
