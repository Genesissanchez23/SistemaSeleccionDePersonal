import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  template: `
    <p class="mt-2 mb-4">{{title}}</p>
  `,
  styles: `
    p {
      font-family: 'astonpoliz', sans-serif;  
      line-height: 33px; 
      font-size: 1.7rem;
    }
  `
})
export class TitleComponent {

  @Input({required: true}) title!: string

}
