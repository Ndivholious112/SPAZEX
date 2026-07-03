package com.shaper.hackathon.entity;

import com.shaper.hackathon.entity.enums.PaymentMethod;
import com.shaper.hackathon.entity.enums.SaleStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"shop", "customer", "cashier", "saleItems"})
@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sale_id")
    private Integer saleId;

    @Column(name = "sale_date", nullable = false, updatable = false)
    private LocalDateTime saleDate;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "receipt_number", nullable = false, unique = true)
    private String receiptNumber;

    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "discount", precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "vat", precision = 10, scale = 2)
    private BigDecimal vat = BigDecimal.ZERO;

    @Column(name = "profit", precision = 10, scale = 2)
    private BigDecimal profit = BigDecimal.ZERO;

    @Column(name = "total_items")
    private Integer totalItems = 0;

    @Column(name = "ai_fraud_score", precision = 5, scale = 2)
    private BigDecimal aiFraudScore;

    @Column(name = "ai_sales_prediction", precision = 10, scale = 2)
    private BigDecimal aiSalesPrediction;

    @Column(length = 500)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SaleStatus status = SaleStatus.COMPLETED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cashier_id", nullable = false)
    private User cashier;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SaleItem> saleItems = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();

        if (saleDate == null) {
            saleDate = now;
        }

        updatedAt = now;

        if (discount == null) {
            discount = BigDecimal.ZERO;
        }

        if (vat == null) {
            vat = BigDecimal.ZERO;
        }

        if (profit == null) {
            profit = BigDecimal.ZERO;
        }

        if (totalItems == null) {
            totalItems = 0;
        }

        if (status == null) {
            status = SaleStatus.COMPLETED;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addSaleItem(SaleItem item) {
        saleItems.add(item);
        item.setSale(this);
    }

    public void removeSaleItem(SaleItem item) {
        saleItems.remove(item);
        item.setSale(null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sale sale)) {
            return false;
        }
        return saleId != null && saleId.equals(sale.saleId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}