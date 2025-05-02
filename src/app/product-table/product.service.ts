import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsResponse } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(skip: number): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`https://dummyjson.com/products?limit=10&skip=${skip}`);
  }

  getAllProducts(): Observable<ProductsResponse> {
    // Adjust limit according to your needs, here fetching all products at once
    return this.http.get<ProductsResponse>(`https://dummyjson.com/products?limit=200`);
  }
}
