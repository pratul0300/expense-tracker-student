package com.expensetracker.dto;

import java.math.BigDecimal;
import java.util.List;

public record CategoryBreakdownResponse(
    Integer yearFilter, Integer monthFilter, BigDecimal monthTotal, List<CategoryTotalResponse> categories) {}
