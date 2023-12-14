import { Component, ElementRef,  ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Product } from 'src/app/interfaces/product';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { AlertService } from 'src/app/services/alert.service';
import { category } from 'src/app/interfaces/category';


@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProductsPage   {
  private apiService = inject(ApiService);
  private alertService = inject(AlertService);
  private formBuilder = inject(FormBuilder);

  @ViewChild('eleImages') input!: ElementRef<HTMLInputElement>;

  private rawProducts: Product[] = [];

  public newProductForm!: FormGroup;
  public products = [...this.rawProducts];
  public productId = 0;
  public imagePreview: string | ArrayBuffer | null = null;

  categories: category[] = [];

  constructor() {
    addIcons({ createOutline, trashOutline });
    this.initializeForm();
    this.loadCategories();
    this.GetProducts();
    this.GetPlaceholderImage();
  }

  initializeForm() {
    this.newProductForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      price: [null, [Validators.required, Validators.min(0)]],
      gst: [''],
      category: [''],
      productImage: ['', [Validators.required]],
    });
  }

  loadCategories() {
    this.apiService.GetCategories().subscribe(
      (categories: any) => {
        this.categories = categories;
      }
    );
  }


  GetProducts() {
    this.apiService.GetProducts().subscribe((data: Product[]) => {
      this.rawProducts = data;
      this.products = [...this.rawProducts];
    });
  }

  AddProduct() {

    if (this.productId > 0) {
      this.newProductForm.controls['productImage'].removeValidators([Validators.required]);
      this.newProductForm.controls['productImage'].updateValueAndValidity()
    }

    if (this.newProductForm.valid) {

      const formData = new FormData();
      formData.append('name', this.newProductForm.value.name);
      formData.append('price', this.newProductForm.value.price);
      formData.append('gst', this.newProductForm.value.gst == '' ? 0 : this.newProductForm.value.gst);
      formData.append('categoryId', this.newProductForm.value.category);

      if (this.newProductForm.value.productImage != '') {
        formData.append('productImage', this.newProductForm.value.productImage);
      }

      if (this.productId === 0) {
        this.apiService.AddProduct(formData).subscribe(
          (response: any) => {
            this.alertService.successToast(response.message);
            this.Reset();
          });
      }
      else {
        this.apiService.EditProduct(this.productId, formData).subscribe(
          (response: any) => {
            this.alertService.successToast(response.message);
            this.Reset();
          });
      }
    }
    else {
      this.newProductForm.markAllAsTouched();
    }
  }

  GetProduct(Id: number) {

    const product = this.rawProducts.find(x => x.id == Id);
    if (product != null) {
      this.newProductForm.reset();
      this.productId = Id;
      this.newProductForm.get('name')?.patchValue(product?.name);
      this.newProductForm.get('price')?.patchValue(product?.price);
      this.newProductForm.get('gst')?.patchValue(product?.gst);
      this.newProductForm.get('category')?.patchValue(product?.categoryId);
      this.imagePreview = product?.imgPath ?? '';
    }
  }

  DeleteProduct(Id: number) {
    const alertButtons = [
      {
        text: 'NO',
        role: 'cancel',
        handler: () => {
          console.log('Alert canceled');
        },
      },
      {
        text: 'YES',
        role: 'confirm',
        handler: () => {
          this.apiService.DeleteProduct(Id).subscribe(() => {
            this.alertService.errorToast('Deleted Successfully');
            this.GetProducts();
          });
        },
      },
    ];

    this.alertService.showAlert('Do you want to delete this product?', 'DELETE', alertButtons);
  }


  Reset() {
    this.productId = 0;
    this.newProductForm.reset();
    this.imagePreview = null;
    this.input.nativeElement.value = "";
    this.newProductForm.controls['productImage'].setValidators([Validators.required]);
    this.newProductForm.controls['productImage'].updateValueAndValidity();
    this.GetPlaceholderImage();
    this.GetProducts();
  }

  findProducts(event: any) {
    const query = event.target.value.toLowerCase();  
    this.products = [... this.rawProducts.filter((p) => p.name.toLowerCase().includes(query))];    
  }

  GetPlaceholderImage() {
    this.apiService.GetPlaceholderImage().subscribe(async (data) => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(data);
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      };
    })
  }


  onFileChange(event: any) {
    const fileInput = event.target;
    const file = fileInput.files?.[0];

    if (file) {
      // Set the file in the form control
      this.newProductForm.patchValue({
        productImage: file,
      });

      // Read and display the image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getErrorText(control: string) {
    const validations = this.validation_messages[control]
    for (let validation of validations) {
      if (this.newProductForm.get(control)?.touched && this.newProductForm.get(control)?.hasError(validation.type))
        return validation.message;
    }
    return '';
  }

  public validation_messages: any = {
    'name': [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Minimum 3 characters required' },
      { type: 'maxlength', message: 'Exceeded the max length 50' },
    ],
    'price': [{ type: 'required', message: 'Price is required' }],
    'productImage': [{ type: 'required', message: 'Image is required, Please select the Image' }]
  }

}
