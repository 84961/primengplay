import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product, ProductsResponse } from './product';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ProductService } from './product.service';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';
import { SidebarService } from '../services/sidebar.service';

type TableFilters = { [key: string]: { value: any; matchMode: string; } | { value: any; matchMode: string; }[] };

@Component({
    selector: 'app-root',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    standalone: true,
    imports: [
        TableModule,
        CurrencyPipe,
        FormsModule,
        InputSwitchModule,
        InputTextModule,
        InputNumberModule,
        ButtonModule
    ]
})
export class ProductComponent implements OnInit {
    products: Product[] = [];
    totalRecords: number = 0;
    loading: boolean = true;
    isServerSidePagination: boolean = true;
    allProducts: Product[] = [];
    first: number = 0;
    currentSort: { field: string; order: number } = { field: '', order: 1 };
    globalFilterValue: string = '';
    private destroy$ = new Subject<void>();
    private search$ = new Subject<string>();

    constructor(
        private productService: ProductService,
        private sidebarService: SidebarService
    ) { }

    ngOnInit() {
        if (!this.isServerSidePagination) {
            this.loadAllProducts();
        }

        // Setup search observable with debounce
        this.search$.pipe(
            takeUntil(this.destroy$),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(searchValue => {
                this.loading = true;
                this.first = 0; // Reset to first page
                if (this.isServerSidePagination) {
                    return this.productService.getProducts(
                        0,
                        this.currentSort.field,
                        this.currentSort.order,
                        {},
                        searchValue
                    );
                } else {
                    return of(searchValue);
                }
            })
        ).subscribe({
            next: (response) => {
                this.loading = false;
                if (this.isServerSidePagination && response instanceof Object) {
                    const productResponse = response as ProductsResponse;
                    this.products = productResponse.products;
                    this.totalRecords = productResponse.total;
                } else {
                    // Client-side filtering
                    let filteredData = [...this.allProducts];
                    if (this.globalFilterValue) {
                        filteredData = filteredData.filter(item => 
                            Object.values(item).some(val => 
                                String(val).toLowerCase().includes(this.globalFilterValue.toLowerCase())
                            )
                        );
                    }
                    if (this.currentSort.field) {
                        filteredData = this.applySort(filteredData);
                    }
                    this.totalRecords = filteredData.length;
                    this.products = filteredData;
                }
            },
            error: (error) => {
                this.loading = false;
                console.error('Error during search:', error);
            }
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    togglePagination() {
        this.first = 0;
        this.loading = true;
        this.products = [];
        this.allProducts = [];
        this.totalRecords = 0;
        this.currentSort = { field: '', order: 1 };
        
        if (this.isServerSidePagination) {
            this.loadProducts({ first: 0, rows: 10 });
        } else {
            this.loadAllProducts();
        }
    }

    loadAllProducts() {
        this.loading = true;
        this.productService.getAllProducts()
            .pipe(takeUntil(this.destroy$)) 
            .subscribe({
                next: (response: ProductsResponse) => {
                    this.loading = false;
                    this.allProducts = response.products;
                    this.totalRecords = response.total;
                    this.applyClientSideOperations({ filters: {} });
                },
                error: (error) => {
                    this.loading = false;
                    console.error('Error loading products:', error);
                }
            });
    }

    loadProducts($event: TableLazyLoadEvent) {
        if (!this.isServerSidePagination) {
            this.handleClientSideOperations($event);
            return;
        }
        
        this.loading = true;
        
        // Update sort state
        if ($event.sortField) {
            this.currentSort.field = Array.isArray($event.sortField) ? $event.sortField[0] : $event.sortField;
            this.currentSort.order = $event.sortOrder || 1;
        }

        // Call service with all params
        this.productService.getProducts(
            $event.first || 0,
            this.currentSort.field,
            this.currentSort.order,
            $event.filters as TableFilters || {},
            this.globalFilterValue
        )
        .pipe(takeUntil(this.destroy$)) 
        .pipe(debounceTime(300))    
        .subscribe({
            next: (response: ProductsResponse) => {
                this.loading = false;
                this.products = response.products;
                this.totalRecords = response.total;
            },
            error: (error) => {
                this.loading = false;
                console.error('Error loading products:', error);
            }
        });
    }

    onGlobalFilter(event: Event) {
        const element = event.target as HTMLInputElement;
        this.globalFilterValue = element.value;
        this.search$.next(this.globalFilterValue);
    }

    clear(table: Table) {
        // Reset all filters
        this.globalFilterValue = '';
        
        // Clear the table filters
        table.clear();
        
        // Reset pagination
        this.first = 0;
        
        // Reload data
        if (this.isServerSidePagination) {
            this.loadProducts({ first: 0, rows: 10, filters: {} });
        } else {
            this.applyClientSideOperations({ filters: {} });
        }
    }

    private handleClientSideOperations($event: TableLazyLoadEvent) {
        this.loading = true;
        this.applyClientSideOperations($event);
        this.loading = false;
    }

    private applyClientSideOperations($event: TableLazyLoadEvent) {
        let filteredData = [...this.allProducts];

        // Apply filters if any
        if ($event.filters && Object.keys($event.filters).length > 0) {
            filteredData = this.applyFilters(filteredData, $event.filters as TableFilters);
        }

        // Apply sorting
        if (this.currentSort.field) {
            filteredData = this.applySort(filteredData);
        }

        this.totalRecords = filteredData.length;
        this.products = filteredData;
    }

    private applyFilters(data: Product[], filters: TableFilters): Product[] {
        return data.filter(item => {
            return Object.entries(filters).every(([field, constraint]) => {
                const filterConstraint = Array.isArray(constraint) ? constraint[0] : constraint;
                // Skip if filter value is null
                if (!filterConstraint || filterConstraint.value === null || filterConstraint.value === undefined || filterConstraint.value === '') {
                    return true;
                }

                const itemValue = (item as any)[field];
                const filterValue = filterConstraint.value;
                const matchMode = filterConstraint.matchMode;

                if (typeof itemValue === 'number') {
                    const numericFilter = Number(filterValue);
                    switch (matchMode) {
                        case 'equals':
                            return itemValue === numericFilter;
                        case 'notEquals':
                            return itemValue !== numericFilter;
                        case 'lt':
                            return itemValue < numericFilter;
                        case 'lte':
                            return itemValue <= numericFilter;
                        case 'gt':
                            return itemValue > numericFilter;
                        case 'gte':
                            return itemValue >= numericFilter;
                        default:
                            return itemValue === numericFilter;
                    }
                } else {
                    const strValue = String(itemValue).toLowerCase();
                    const searchValue = String(filterValue).toLowerCase();
                    switch (matchMode) {
                        case 'startsWith':
                            return strValue.startsWith(searchValue);
                        case 'contains':
                            return strValue.includes(searchValue);
                        case 'notContains':
                            return !strValue.includes(searchValue);
                        case 'endsWith':
                            return strValue.endsWith(searchValue);
                        case 'equals':
                            return strValue === searchValue;
                        case 'notEquals':
                            return strValue !== searchValue;
                        default:
                            return strValue.includes(searchValue);
                    }
                }
            });
        });
    }

    private applySort(data: Product[]): Product[] {
        const { field, order } = this.currentSort;
        return [...data].sort((a, b) => {
            const valueA = (a as any)[field];
            const valueB = (b as any)[field];
            
            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return (valueA - valueB) * order;
            }
            
            return String(valueA).localeCompare(String(valueB)) * order;
        });
    }

    requestChange(product: Product) {
        this.sidebarService.openSidebar(product);
    }
}