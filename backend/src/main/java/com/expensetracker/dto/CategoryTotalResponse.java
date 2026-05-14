package com.expensetracker.dto;

import com.expensetracker.entity.ExpenseCategory;
import java.math.BigDecimal;

public record CategoryTotalResponse(ExpenseCategory category, String categoryDisplayName, BigDecimal total) {}
