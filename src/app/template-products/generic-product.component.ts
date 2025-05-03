import { Component } from '@angular/core';
import { PRODUCTS } from './products';
import { MOVIES } from './movies';
import { GenericTableWithTemplateOutletComponent } from './generic-table-template-outlet.component';
import { GenericTableWithSwitchComponent } from './generic-table-with-switch.component';

export interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'app-generic-product',
    standalone: true,
    imports: [GenericTableWithTemplateOutletComponent, GenericTableWithSwitchComponent],
    styleUrls: [],
    template: `
        <h4>Generic Products Table</h4>
    <app-generic-table-outlet [data]="PRODUCTS">
      <ng-template #header>
          <th>Product ID</th>
          <th>Name</th>
          <th>From</th>
          <th>Price</th>
      </ng-template>
      <ng-template #row let-row="row">
         <td>{{ row.id }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.madeIn }}</td>
          <td>{{ row.price }}</td>
      </ng-template>
     </app-generic-table-outlet>

    <h4>Generic Movies Table with dynamic rows and columns</h4>

    <app-generic-table-with-switch [data]="MOVIES" [columns]="movieColumns"/>
  `,
})
export class GenericProductTableComponent {
    MOVIES = MOVIES;
    PRODUCTS = PRODUCTS;

    movieColumns: Column[] = [
        { field: 'id', header: 'Movie ID' },
        { field: 'title', header: 'Title' },
        { field: 'rating', header: 'Rating ' },
        { field: 'year', header: 'Year' },
    ];

    productColumns: Column[] = [
        { field: 'id', header: 'Product ID' },
        { field: 'name', header: 'Name' },
        { field: 'madeIn', header: 'From ' },
        { field: 'price', header: 'Price' },
    ];
}

