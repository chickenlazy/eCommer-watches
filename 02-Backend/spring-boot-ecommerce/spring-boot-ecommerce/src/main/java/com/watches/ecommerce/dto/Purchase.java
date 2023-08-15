package com.watches.ecommerce.dto;

import com.watches.ecommerce.entity.Address;
import com.watches.ecommerce.entity.Customer;
import com.watches.ecommerce.entity.Order;
import com.watches.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;

    private Address shippingAddress;

    private Address billingAddress;

    private Order order;

    private Set<OrderItem> orderItems;





}
