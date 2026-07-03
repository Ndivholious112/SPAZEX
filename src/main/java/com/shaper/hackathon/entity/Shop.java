package com.shaper.hackathon.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString(exclude = {"products", "users"}) // Prevents StackOverflowError
@Entity
@Table(name = "shop") // Standardized singular naming
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer shopId;

    @Column(nullable = false, length = 100)
    private String shopName;

    private String ownerName;

    @Column(length = 20)
    private String phone;

    private String address;

    @Column(length = 10)
    private String language;

    @Column(nullable = false, updatable = false)
    private LocalDate createdDate;

    // Initialized to avoid NullPointerException
    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products = new ArrayList<>();

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<User> users = new ArrayList<>();

    // Helper methods to maintain bi-directional consistency
    public void addProduct(Product product) {
        products.add(product);
        product.setShop(this);
    }

    public void removeProduct(Product product) {
        products.remove(product);
        product.setShop(null);
    }
}

