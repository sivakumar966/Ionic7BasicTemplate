import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRow, IonCol, IonText, IonCard, IonButton } from '@ionic/angular/standalone';
import { TableModule } from 'primeng/table';
import { ApiService } from 'src/app/services/api.service';
import { Order, OrderReport } from 'src/app/interfaces/order-report';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [IonButton, IonCard, IonText, IonCol, IonRow, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TableModule, ButtonModule, CalendarModule]
})
export class ReportsPage {

  totalRecords: number = 0;
  limit: number = 10;
  loading: boolean = true;
  orders: Order[] = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();

  constructor(public apiService: ApiService) {
    this.fromDate.setMonth(this.fromDate.getMonth() - 1);
  }



  loadOrders(pagenumber: number) {
    this.loading = true;
    this.apiService.GetOrderReport(this.fromDate, this.toDate, this.limit, pagenumber).subscribe(
      (response: OrderReport) => {
        this.loading = false;
        this.totalRecords = response.total;
        this.orders = response.orders;
      }
    );
  }

  DownloadReport() {
    this.apiService.GetOrderReportForDownload(this.fromDate, this.toDate).subscribe(
      (data) => {
        this.downloadFile(data);
      });
  }

  downloadFile(data: any) {

    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    // window.open(url);

    let downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.setAttribute('download', 'orders.xlsx');
    document.body.appendChild(downloadLink);
    downloadLink.click();

  }

}
