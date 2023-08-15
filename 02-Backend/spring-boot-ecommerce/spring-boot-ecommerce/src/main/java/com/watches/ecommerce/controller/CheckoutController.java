package com.watches.ecommerce.controller;

import com.watches.ecommerce.dto.Purchase;
import com.watches.ecommerce.dto.PurchaseResponse;
import com.watches.ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase") //xác định rằng phương thức này sẽ được kích hoạt khi có yêu cầu HTTP POST gửi đến đường dẫn "/purchase"
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

        return purchaseResponse;
    }










}
