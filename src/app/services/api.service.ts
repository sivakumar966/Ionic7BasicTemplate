import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';
import { Observable, delay, map } from 'rxjs';
import { category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient) {

  }


  GetProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiURL}/api/products`)
      .pipe(
        map((products: Product[]) => {
          products.forEach(x => x.imgPath = `${environment.apiURL}/${x.imgPath}`);
          return products;
        })
      );
  }

  AddProduct(product: FormData) {
    return this.http.post(`${environment.apiURL}/api/products`, product, { responseType: 'json' });
  }

  EditProduct(productId: number, product: FormData) {
    return this.http.put(`${environment.apiURL}/api/products/${productId}`, product);
  }

  DeleteProduct(Id: number) {
    return this.http.delete(`${environment.apiURL}/api/products/${Id}`);
  }

  GetCategories(): Observable<category[]> {
    return this.http.get<category[]>(`${environment.apiURL}/api/categories/`);
  }

  GetPlaceholderImage(url: string = '') {
    if (url === '') {
      url = '../assets/images/product-placeholder.webp';
    }
    return this.http.get(url, { responseType: 'blob' });
  }


}
