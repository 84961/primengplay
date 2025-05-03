import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsResponse } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getProducts(
    skip: number, 
    sortField?: string, 
    sortOrder?: number, 
    filters?: any,
    globalFilter?: string
  ): Observable<ProductsResponse> {
    const page = Math.floor(skip / 10);
    const payload = {
      page,
      limit: 10,
      sortField,
      sortOrder: sortOrder || 1,
      filters,
      globalFilter
    };

    return this.http.post<ProductsResponse>(`${this.baseUrl}/products`, payload);
  }

  getAllProducts(
    sortField?: string, 
    sortOrder?: number, 
    filters?: any,
    globalFilter?: string
  ): Observable<ProductsResponse> {
    let params: any = {
      limit: 100
    };

    if (sortField) {
      params.sortField = sortField;
      params.sortOrder = sortOrder || 1;
    }

    if (filters && Object.keys(filters).length > 0) {
      params.filters = JSON.stringify(filters);
    }

    if (globalFilter) {
      params.globalFilter = globalFilter;
    }

    return this.http.get<ProductsResponse>(`${this.baseUrl}/products`, { params });
  }
}
