import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <p [ngClass]="{'xsmall-text': xsmall, 'text': !xsmall}">{{ text }}</p>
  `,
  styles: `
    .text {
      font-size: small;
      font-family: 'astonpoliz', sans-serif;
    } 

    .xsmall-text {
        font-size: x-small;
        font-family: 'astonpoliz', sans-serif;
    }
  `
})
export class TextComponent {

  @Input({ required: true }) text!: string
  @Input({ required: false }) xsmall: boolean = false

} 