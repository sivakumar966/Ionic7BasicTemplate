import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';
import { Observable, delay, map } from 'rxjs';
import { category } from '../interfaces/category';
import { CategoryWiseStock } from '../interfaces/stock';
import { OrderReport } from '../interfaces/order-report';
import { formatDate } from '@angular/common';


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


  GetPlaceholderImage(url: string = '') {
    if (url === '') {
      url = '../assets/images/product-placeholder.webp';
    }
    return this.http.get(url, { responseType: 'blob' });
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

  GetCategoryWiseStocksAsync(): Observable<CategoryWiseStock[]> {
    return this.http.get<CategoryWiseStock[]>(`${environment.apiURL}/api/kiosk/stocks`);
  }

  UpdateStock(stock: any) {
    return this.http.post(`${environment.apiURL}/api/kiosk/stocks`, stock, { responseType: 'json' });
  }

  GetOrderReport(fromDate: Date, toDate: Date, limit: number, skip: number) {
    return this.http.get<OrderReport>(`${environment.apiURL}/api/kiosk/reports/orders?fromDate=${formatDate(fromDate, 'yyyy-MM-dd', 'en_US')}&toDate=${formatDate(toDate, 'yyyy-MM-dd', 'en_US')}&limit=${limit}&skip=${skip}`);
  }

  GetOrderReportForDownload(fromDate: Date, toDate: Date) {
    return this.http.get(`${environment.apiURL}/api/kiosk/reports/download/orders?fromDate=${formatDate(fromDate, 'yyyy-MM-dd', 'en_US')}&toDate=${formatDate(toDate, 'yyyy-MM-dd', 'en_US')}`, { responseType: 'blob' });
  }

}
