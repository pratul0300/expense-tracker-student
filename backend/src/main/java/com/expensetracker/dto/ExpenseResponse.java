package com.expensetracker.dto;

import com.expensetracker.entity.Expense;
import com.expensetracker.entity.ExpenseCategory;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseResponse(
    Long id,
    String title,
    BigDecimal amount,
    ExpenseCategory category,
    String categoryDisplayName,
    LocalDate date,
    String description) {

  public static ExpenseResponse from(Expense expense) {
    ExpenseCategory category = expense.getCategory();
    return new ExpenseResponse(
        expense.getId(),
        expense.getTitle(),
        expense.getAmount(),
        category,
        category != null ? category.getDisplayName() : null,
        expense.getDate(),
        expense.getDescription());
  }
}
