package com.watches.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="customer")
@Getter
@Setter

public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="firstName")
    private String firstName;

    @Column(name="lastName")
    private String lastName;

    @Column(name="email")
    private String email;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL) // cho phép tất cả các hoạt động (tạo, cập nhật, xóa) trên Customer được áp dụng lên tất cả các Order liên quan.
    private Set<Order> orders = new HashSet<>();

    public void add(Order order) {
        if (order != null) {
            if (orders == null) {
                orders = new HashSet<>(); // Khởi tạo set nếu chưa có
            }

            orders.add(order); // Thêm Order vào Set
            order.setCustomer(this); // Đặt liên kết Customer cho Order
        }
    }









}
