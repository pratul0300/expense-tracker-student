package com.expensetracker.dto;

import com.expensetracker.entity.ExpenseCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseRequest {

  @NotBlank
  @Size(max = 200)
  private String title;

  @NotNull
  @DecimalMin(value = "0.01", inclusive = true, message = "amount must be at least 0.01")
  private BigDecimal amount;

  @NotNull
  private ExpenseCategory category;

  @NotNull
  private LocalDate date;

  @Size(max = 2000)
  private String description;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public ExpenseCategory getCategory() {
    return category;
  }

  public void setCategory(ExpenseCategory category) {
    this.category = category;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
}
