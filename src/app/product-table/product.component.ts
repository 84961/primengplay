import { Component, OnInit } from '@angular/core';
import { Product, ProductsResponse } from './product';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ProductService } from './product.service';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    imports: [TableModule, CurrencyPipe, FormsModule]
})
export class ProductComponent implements OnInit {
    products: Product[] = [];
    totalRecords: number = 0;
    loading: boolean = true;
    isServerSidePagination: boolean = true; // flag to control pagination type
    allProducts: Product[] = []; // store all products for client-side pagination
    first: number = 0;

    constructor(private productService: ProductService) { }

    ngOnInit() {
        // Initial load based on pagination type
        if (!this.isServerSidePagination) {
            this.loadAllProducts();
        }
    }

    togglePagination() {
        this.first = 0; // Reset to first page
        this.loading = true;
        this.products = []; // Clear current data
        this.allProducts = []; // Clear all products
        this.totalRecords = 0; // Reset total records
        
        if (this.isServerSidePagination) {
            this.loadProducts({ first: 0, rows: 10 });
        } else {
            this.loadAllProducts();
        }
    }

    loadAllProducts() {
        this.loading = true;
        this.productService.getAllProducts().subscribe(
            (response: ProductsResponse) => {
                this.loading = false;
                this.allProducts = response.products;
                this.products = []; // Clear server-side data
                this.totalRecords = response.total;
                this.first = 0; // Ensure we're at first page
            }
        );
    }

    loadProducts($event: TableLazyLoadEvent) {
        if (!this.isServerSidePagination) {
            return; // Don't process if client-side pagination
        }
        this.loading = true;
        this.loadServerSideProducts($event);
    }

    private loadServerSideProducts($event: TableLazyLoadEvent) {
        this.productService.getProducts($event.first || 0).subscribe(
            (response: ProductsResponse) => {
                this.loading = false;
                this.products = response.products;
                this.totalRecords = response.total;
            }
        );
    }
}