import { CommonModule} from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { StarRatingComponent } from './star-rating.component';

export interface Column {
  field: string;
  header: string;
  type?: 'rating' | 'text' | 'date' | 'number';
}

@Component({
  selector: 'app-generic-table-with-switch',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  styles: [
    `table {
      border-collapse: collapse;
      width: 100%;
    }
    
    th,
    td {
      text-align: left;
      padding: 8px;
    }
    
    th {
      background-color: #4caf50;
      color: white;
    }
    
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    
    tr:hover {
      background-color: #ddd;
    }`,
  ],
  template: `
    <table> 
      <thead>
        <tr>
        @for (column of columns(); track column.field) {
            <th>{{ column.header }}</th>
          }
        </tr>
      </thead>
      <tbody>
      @for (row of data(); track row.id) {
          <tr>
            @for (column of columns(); track column.field) {
              <td>
                @switch (column.type) {
                  @case ('rating') {
                    <app-star-rating [rating]="row[column.field]"></app-star-rating>
                  }
                  @default {
                    {{ row[column.field] }}
                  }
                }
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class GenericTableWithSwitchComponent {
    data = input.required<any[]>();
    columns = input.required<Column[]>();
}