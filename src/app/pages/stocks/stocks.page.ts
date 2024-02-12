import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CategoryWiseStock } from 'src/app/interfaces/stock';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.page.html',
  styleUrls: ['./stocks.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StocksPage {

  categoryStocks: CategoryWiseStock[] = [];

  constructor(public api: ApiService, public alertService: AlertService) {
    this.GetStocks();
  }

  GetStocks() {
    this.api.GetCategoryWiseStocksAsync().subscribe((data: CategoryWiseStock[]) => {
      data.forEach(c => c.products.forEach(p => p.imgPath = `${environment.apiURL}/${p.imgPath}`));
      this.categoryStocks = data;

    });
  }

  UpdateStock(ProductId: number, IsAvailable: boolean, Stock: any) {
    const stockDto = {
      ProductId: ProductId,
      IsAvailable: IsAvailable,
      Stock: Number.parseInt(Stock)
    }
    this.api.UpdateStock(stockDto).subscribe(
      (data: any) => {
        this.alertService.successToast(data.message);
      });
  }

  AvaliableChange(isAvailable: boolean) {
    console.log(isAvailable);
    // console.log(event.detail.checked);
  }

  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

}
