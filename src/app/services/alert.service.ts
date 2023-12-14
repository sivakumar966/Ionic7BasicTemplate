import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController, AlertButton, AlertInput } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  isLoading: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController) {

  }


  setLoader() {
    this.isLoading = !this.isLoading;
  }

  showAlert(message: string, header?: string | undefined, buttonArray?: (string | AlertButton)[] | undefined, inputs?: AlertInput[] | undefined) {

    if (this.isLoading)
      this.hideLoader();

    this.alertCtrl
      .create({
        header: header ? header : 'ALERT',
        message: message,
        inputs: inputs ? inputs : [],
        buttons: buttonArray ? buttonArray : ['Ok'],
      })
      .then((alertEle) => alertEle.present());
  }

  async showToast(message: any, color: string, position: any, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      color: color,
      position: position,
    });
    toast.present();
  }

  errorToast(message?: any, duration = 3000) {
    this.showToast(
      message ? message : 'No Internet Connection',
      'danger',
      'bottom',
      duration
    );
  }

  successToast(message: string) {
    this.showToast(message, 'success', 'bottom');
  }

  showLoader(msg?: any, spinner?: any | null | undefined) {
    // this.isLoading = true;
    if (!this.isLoading) this.setLoader();
    return this.loadingCtrl
      .create({
        message: msg,
        spinner: spinner ? spinner : 'bubbles',
      })
      .then((res) => {
        res.present().then(() => {
          if (!this.isLoading) {
            res.dismiss().then(() => {
              // console.log('abort presenting');
            });
          }
        });
      })
      .catch((e) => {
        // console.log('show loading error: ', e);
      });
  }

  hideLoader() {
    if (this.isLoading) this.setLoader();
    return this.loadingCtrl.dismiss();
  }


}
