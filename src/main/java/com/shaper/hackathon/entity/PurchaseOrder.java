package com.shaper.hackathon.entity;

import com.shaper.hackathon.entity.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString(exclude = {"shop", "supplier", "purchaseItems"})
@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchase_order_id")
    private Integer purchaseOrderId;

    @Column(name = "order_date", nullable = false, updatable = false)
    private LocalDateTime orderDate;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "expected_delivery_date")
    private LocalDate expectedDeliveryDate;

    @Column(name = "actual_delivery_date")
    private LocalDate actualDeliveryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "receipt_number", unique = true, length = 100)
    private String receiptNumber;

    @Column(name = "total_cost", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalCost = BigDecimal.ZERO;

    @Column(length = 500)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @OneToMany(mappedBy = "purchaseOrder",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<PurchaseItem> purchaseItems = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();

        if (orderDate == null) {
            orderDate = now;
        }

        updatedAt = now;

        if (status == null) {
            status = OrderStatus.PENDING;
        }

        if (totalCost == null) {
            totalCost = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addPurchaseItem(PurchaseItem item) {
        purchaseItems.add(item);
        item.setPurchaseOrder(this);
    }

    public void removePurchaseItem(PurchaseItem item) {
        purchaseItems.remove(item);
        item.setPurchaseOrder(null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (!(o instanceof PurchaseOrder purchaseOrder)) {
            return false;
        }

        return purchaseOrderId != null &&
                purchaseOrderId.equals(purchaseOrder.purchaseOrderId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
