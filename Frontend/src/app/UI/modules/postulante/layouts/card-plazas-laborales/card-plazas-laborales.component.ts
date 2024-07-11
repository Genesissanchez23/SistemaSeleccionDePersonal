import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TrabajoModel } from '@domain/models/trabajos/trabajo.model';

@Component({
  selector: 'app-card-plazas-laborales',
  standalone: true,
  imports: [MatProgressBarModule, CommonModule, MatTooltipModule],
  templateUrl: './card-plazas-laborales.component.html',
  styleUrl: './card-plazas-laborales.component.css'
})
export class CardPlazasLaboralesComponent implements OnInit, OnChanges {

  @Input({ required: true }) data: TrabajoModel[] = []
  public list: TrabajoModel[] = []
  public favoriteIds: Set<number> = new Set<number>();

  ngOnChanges(changes: SimpleChanges) {
    if ('data' in changes) {
      this.list = changes['data'].currentValue;
    }
  }

  ngOnInit(): void {
    this.list = this.data
    this.loadFavorites()
  }

  toggleFavorite(itemId: number) {
    if (this.favoriteIds.has(itemId)) {
      this.favoriteIds.delete(itemId);
    } else {
      this.favoriteIds.add(itemId);
    }
    this.saveFavorites();
  }

  saveFavorites() {
    localStorage.setItem('favoriteIds', JSON.stringify(Array.from(this.favoriteIds)));
  }

  loadFavorites() {
    const savedFavorites = localStorage.getItem('favoriteIds');
    if (savedFavorites) {
      this.favoriteIds = new Set<number>(JSON.parse(savedFavorites));
    }
  }

  isFavorite(itemId: number): boolean {
    return this.favoriteIds.has(itemId);
  }

}
