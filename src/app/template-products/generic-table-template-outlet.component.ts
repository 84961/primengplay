import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-generic-table-outlet',
  standalone: true,
  imports: [NgTemplateOutlet],
  styleUrls: ['./generic-table-template-outlet.component.scss'],
  template: `
    <table> 
      <thead>
        <tr>
          <ng-container [ngTemplateOutlet]="header"></ng-container>
        </tr>
      </thead>
      <tbody>
      @for (rowData of data(); track rowData.id) {
        <tr>
          <ng-container 
            [ngTemplateOutlet]="row" 
            [ngTemplateOutletContext]="{ row: rowData }">
          </ng-container>
        </tr>
      }
      </tbody>
    </table>
  `,
})
export class GenericTableWithTemplateOutletComponent {
  data = input.required<any[]>();

  @ContentChild('header') header!: TemplateRef<any>;
  @ContentChild('row') row!: TemplateRef<any>;
}