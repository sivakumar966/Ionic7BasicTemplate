import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;



  constructor(
    private fb: FormBuilder,
    private alertServiec: AlertService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
    });
  }


  validation_messages: any = {
    username: [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Minimum 3 characters required' },
      { type: 'maxlength', message: 'Exceeded the max length 50' },
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Minimum 8 characters required' },
      { type: 'pattern', message: 'Alphanumeric password with aleast one lower case letter and one upper case letter and one digit and one symbol required' },
    ]
  }

  async onSubmit() {

    if (!this.loginForm.valid)
      return;

    this.alertServiec.showLoader();

    this.authService.login(this.loginForm.value).then(success => {
      if (success) {
        this.loginForm.reset();
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl], { replaceUrl: true });
      }
      this.alertServiec.hideLoader();
    });

  }

  getErrorText(control: string) {
    const validations = this.validation_messages[control]
    for (let validation of validations) {
      if (this.loginForm.get(control)?.hasError(validation.type))
        return validation.message;
    }
    return '';
  }
}
