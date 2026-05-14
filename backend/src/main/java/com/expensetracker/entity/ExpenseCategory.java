package com.expensetracker.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.Locale;

public enum ExpenseCategory {
  FOOD("Food & groceries"),
  TRAVEL("Travel & transit"),
  SHOPPING("Shopping & supplies"),
  BILLS("Bills & rent"),
  ENTERTAINMENT("Entertainment"),
  OTHER("Other");

  private final String displayName;

  ExpenseCategory(String displayName) {
    this.displayName = displayName;
  }

  public String getDisplayName() {
    return displayName;
  }

  @JsonCreator
  public static ExpenseCategory fromNullable(String raw) {
    if (raw == null || raw.isBlank()) return null;
    return ExpenseCategory.valueOf(raw.trim().toUpperCase(Locale.US));
  }
}
