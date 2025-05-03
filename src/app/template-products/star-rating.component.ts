import { NgClass, NgFor } from '@angular/common';
import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [NgFor, NgClass],
  template: `
    <div class="rating">
      <ng-container *ngFor="let star of [1,2,3,4,5]">
        <i class="bi" [ngClass]="{'bi-star-fill': star <= rating(), 
            'bi-star' : star > rating()}"></i>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .rating {
        display: inline-block;
        font-size: 1.2rem;
      }
      
      .fa-star {
        color: #ddd;
      }
      
      .star-filled {
        color: gold;
      }
    `,
  ],
})
export class StarRatingComponent {
  rating = input.required<number>();
}