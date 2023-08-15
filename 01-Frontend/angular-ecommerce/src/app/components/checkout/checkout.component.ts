import { CartService } from './../../services/cart.service';
import { Country } from './../../common/country';
import { WatchesShopFormService } from './../../services/watches-shop-form.service';
import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { State } from 'src/app/common/state';
import { WatchesShopValidators } from 'src/app/validators/watches-shop-validator';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup = new FormGroup({}); //checkoutFormGroup: property

  totalPrice: number = 0;
  totalQuantity: number = 0;

  //define properties
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private WatchesShopFormService: WatchesShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reviewCartDetail();

    this.checkoutFormGroup = this.formBuilder.group({
      //Group
      customer: this.formBuilder.group({
        //customer: formGroup
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WatchesShopValidators.notOnlyWhitespace,
        ]), //firstName: formControl / ['']
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WatchesShopValidators.notOnlyWhitespace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WatchesShopValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WatchesShopValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WatchesShopValidators.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WatchesShopValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WatchesShopValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WatchesShopValidators.notOnlyWhitespace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WatchesShopValidators.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log('startMonth: ' + startMonth);

    this.WatchesShopFormService.getCreditCardMonth(startMonth).subscribe(
      (data) => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.WatchesShopFormService.getCreditCardYears().subscribe((data) => {
      console.log('Retrieved credit card year: ' + JSON.stringify(data));
      this.creditCardYears = data;
    });

    //populate countries
    this.WatchesShopFormService.getCountries().subscribe((data) => {
      this.countries = data;
    });

    this.WatchesShopFormService.getStates('US').subscribe((data) => {
      this.shippingAddressStates = data;
    });
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get creditCardCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress($event: any) {
    const shippingAddressForm = this.checkoutFormGroup.get('shippingAddress');
    const billingAddressForm = this.checkoutFormGroup.get('billingAddress');

    if (shippingAddressForm && billingAddressForm) {
      if ($event.target.checked) {
        // Nếu checkbox được chọn, sao chép giá trị của địa chỉ giao hàng vào địa chỉ thanh toán
        const shippingAddressValue = shippingAddressForm.value;
        billingAddressForm.patchValue(shippingAddressValue);

        // bug fix for states
        this.billingAddressStates = this.shippingAddressStates;
      } else {
        // Nếu checkbox không được chọn, xóa giá trị của địa chỉ thanh toán để người dùng nhập mới
        billingAddressForm.reset();

        // bug fix for states
        this.billingAddressStates = [];
      }
    }
  }

  onSubmit() {
    console.log('Handling the submit button');

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // Tạo đối tượng order dựa trên các thông tin về giá và số lượng sản phẩm trong giỏ hàng.
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // Lấy danh sách các mặt hàng trong giỏ hàng từ dịch vụ cartService.
    const cartItems = this.cartService.cartItems;

    // Tạo danh sách các đối tượng OrderItem từ danh sách mặt hàng trong giỏ hàng. Đây là các đối tượng dự định để lưu trữ thông tin về các mặt hàng trong đơn hàng.
    let orderItems: OrderItem[] = cartItems.map(
      (cartItem) => new OrderItem(cartItem)
    );

    // Tạo đối tượng purchase để chứa toàn bộ thông tin cần gửi đến API.
    let purchase: Purchase = new Purchase();

    // Lấy thông tin của khách hàng từ biểu mẫu checkoutFormGroup và gán cho trường customer của đối tượng purchase.
    purchase.customer = this.checkoutFormGroup.get('customer')?.value;

    // Lấy thông tin địa chỉ giao hàng từ biểu mẫu checkoutFormGroup và gán cho trường shippingAddress của đối tượng purchase
    purchase.shippingAddress =
      this.checkoutFormGroup.get('shippingAddress')?.value;

    //Tạo các biến shippingState và shippingCountry để lưu tạm thông tin về tiểu bang và quốc gia của địa chỉ giao hàng.
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress?.state)
    );
    const shippingCountry: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress?.country)
    );

    //Gán tên của tiểu bang và quốc gia từ các biến tạm vào đối tượng purchase.shippingAddress để chuẩn bị cho việc gửi dữ liệu.
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // Populate purchase - billing address
    purchase.billingAddress =
      this.checkoutFormGroup.get('billingAddress')?.value;

    // const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
    //  const billingCountry: State = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
    const billingState =
      this.checkoutFormGroup.get('shippingAddress')?.value.state;
    const billingCountry =
      this.checkoutFormGroup.get('shippingAddress')?.value.country;

    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // Populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // Call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(
          `Order placed successfully! Order tracking number: ${response.orderTrackingNumber}`
        );
        this.resetCart();
      },
      error: (err) => {
        alert(`An error occurred: ${err.message}`);
      },
    });
  }

  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form
    this.checkoutFormGroup.reset();

    //navigate back to the products
    this.router.navigateByUrl('/products');
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    if (creditCardFormGroup) {
      const currentYear = new Date().getFullYear();
      const selectedYear = Number(creditCardFormGroup.value.expirationYear);
      console.log(
        'expirationYear: ' + creditCardFormGroup.value.expirationYear
      );

      if (selectedYear !== currentYear) {
        // Nếu năm đã chọn không phải là năm hiện tại, hiển thị tất cả các tháng hợp lệ
        this.WatchesShopFormService.getCreditCardMonth(1).subscribe((data) => {
          this.creditCardMonths = data;
        });
      } else {
        // Nếu năm đã chọn là năm hiện tại, lấy tháng hiện tại trong danh sách tháng
        const currentMonth = new Date().getMonth() + 1;
        this.creditCardMonths = this.creditCardMonths.filter(
          (month) => month >= currentMonth
        );
      }
    }
  }

  getStatesBasedonCountry(formGroupName: string) {
    const keyOfFormGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = keyOfFormGroup?.value.country.code;
    const countryName = keyOfFormGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.WatchesShopFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
    });
  }

  reviewCartDetail() {
    // subscribe to CartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );

    // subscribe to CartService.totalPrice
    this.cartService.totalPrice.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );
  }
}
