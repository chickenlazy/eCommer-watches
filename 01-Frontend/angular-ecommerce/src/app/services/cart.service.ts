import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from './../common/cart-item';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 
  cartItems: CartItem[] = []; // My shopping cart: an array of CartItem Object

  // Khai báo Subject để totalPrice sẽ phát ra giá trị mới qua các lần next()
  // và các component đã đăng ký lắng nghe (subscribe) sẽ nhận được giá trị này
  totalPrice: Subject<number> = new BehaviorSubject<number>(0); //BehaviorSubject
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0); //BehaviorSubject

  constructor() { }

  addToCart(theCartItem: CartItem) {
    // Check if we already have the item in our cart
    let alreadyExistsCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      // Find the item in the cart based on item id
      existingCartItem = this.cartItems.find(item => item.id === theCartItem.id);
      // Check if we found it
      alreadyExistsCart = (existingCartItem !== undefined);
      console.log("alreadyExistsCart: "+alreadyExistsCart)
    }

    if (alreadyExistsCart) {
      // If the item already exists in the cart, update its quantity
      if (existingCartItem) {
        existingCartItem.quantity++;
      }
    } else {
      // If the item does not exist in the cart, add it to the cartItems array
      this.cartItems.push(theCartItem);
    }

    // Calculate and notify total price and total quantity
    this.computeCartTotals();
  }

   computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // Notify subscribers about the new total price and total quantity
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart')
    for(let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity*tempCartItem.unitPrice
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.quantity}, subTotalPrice: ${subTotalPrice}`)
    }

    console.log(`totalPrice: ${totalPriceValue}.toFixed(2), totalQuantityValue: ${totalQuantityValue}`)
    console.log('----------')
  }

  decrementQuantity(theCartItem: CartItem) {
    // Giảm số lượng của mục trong giỏ hàng
    theCartItem.quantity--;

    // Nếu số lượng mục bằng 0, xóa mục khỏi giỏ hàng
    if (theCartItem.quantity === 0) {
      this.removeCartItem(theCartItem);
    }

    // Calculate and notify total price and total quantity
    this.computeCartTotals();
  }

   removeCartItem(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(item => item.id === theCartItem.id);
    if (itemIndex !== -1) {
      this.cartItems.splice(itemIndex, 1);
    }
  }

}

