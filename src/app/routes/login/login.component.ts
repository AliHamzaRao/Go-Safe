import { AfterViewInit, Component, DebugEventListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { AppSettings } from '../../_core/settings/app.settings';
import { Settings } from '../../_core/settings/app.settings.model';
import { userService } from 'src/app/_core/_AppServices/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_core/_AppServices/auth.service';
import { CompanyInfoService } from 'src/app/_core/_AppServices/companyInfoService';
import { Root } from 'src/app/_interfaces/DBresponse.model';
import { CompanyImageService } from 'src/app/_core/_AppServices/companyImgService';
const SECRET_KEY = 'secret_key';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public settings: Settings;
  public um: userService;
  public CompInfo: Root;
  loginStatus: boolean;
  IsOTP: boolean = false;
  loading = false;
  tokenStorage: any = "";
  apiInfoForm: FormGroup;
  ApiInfosubmitted = false;
  img: string;
  currentYear: number = new Date().getFullYear();
  constructor(public appSettings: AppSettings, public fb: FormBuilder, public router: Router, public _userManagement: userService, private toastr: ToastrService, private authService: AuthService, public companyInfoService: CompanyInfoService, public companyImageService: CompanyImageService) {
    this.settings = this.appSettings.settings;
    this.settings.loadingSpinner = false;
    this.um = this._userManagement;
    this.form = this.fb.group({
      'username': [null, Validators.compose([Validators.required])],
      'password': [null, Validators.compose([Validators.required])]
    });
    // this.apiInfoForm = this.fb.group({
    //   ipaddress: [this.um.getIpAddress(), Validators.compose([Validators.required])],
    //   port: [this.um.getPort(), Validators.compose([Validators.required])],
    //   connectAutomatically: [],
    // });
  }
  async ngOnInit() {
    this.img = localStorage.getItem('CompanyLogo');
    this.img = this.img ? `data:image/png;base64,${this.img}` : '../../../assets/logos/logo 1-01.svg';
    this.loading = true;
    await this.companyInfoService.getCompanyInfo().subscribe(data => {
      this.CompInfo = data;
      this.loading = false;
    })
    // this.settings.loadingSpinner = false; 
    this.isEligible();
  }
  isEligible() {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/');
    }
  }
  showSuccess(msg, title) {
    this.toastr.success(msg, title);
  }
  showError(msg, title) {
    this.toastr.error(msg, title);
  }
  showWarning(msg, title) {
    this.toastr.warning(msg, title);
  }
  get apiinfo() { return this.apiInfoForm.controls; }
  async onSubmit(values: { username: string, password: string }) {
    this.loginStatus = false;
    this.loading = true;
    let cmpCode = values.username.split("_");
    let Api = this.CompInfo.network_config.find((item: any) => item.cmp_code === cmpCode[0])
    var apiInfoJson = {
      IpAddress: Api.address,
      Port: Api.port,
      connectAutomatically: true
    }
    await this.companyImageService.getImg(Api.cmp_image).subscribe(data => {
      localStorage.setItem('CompanyLogo', data.src)
    })
    await localStorage.setItem('apiinfo', JSON.stringify(apiInfoJson));
    await this.um.login(values).subscribe(
      (res: any) => {
        this.tokenStorage = res.access_token;
        this.loading = false;
        this.showSuccess("success", "Login successfully");
        this.authService.setToken(res.access_token);
        this.router.navigateByUrl('/');
      },
      err => {
        this.showError("", "User Name or Password is wrong!");
        if (err.status === 400) {
          // this.notifyService.showSuccess('', 'User name or password is incorect');
          // alert("User name or password is incorect")
        } else if (err.status === 500) {
          alert('Something went wrong');
        } else {
        }
        this.loading = false;
      }
    );
    this.router.navigateByUrl('');
  }
  // onApiInfoSubmit() {
  //   var apiInfoJson = {
  //     IpAddress: this.apiinfo.ipaddress.value,
  //     Port: this.apiinfo.port.value,
  //     connectAutomatically: this.apiinfo.connectAutomatically.value
  //   }
  //   this.ApiInfosubmitted = true;
  //   // stop here if form is invalid
  //   if (this.apiInfoForm.invalid) {
  //     return;
  //   }
  //   localStorage.removeItem('apiinfo');
  //   localStorage.setItem('apiinfo', JSON.stringify(apiInfoJson));
  //   this.showSuccess("Success", "Saved scuccessfully");
  // }
}