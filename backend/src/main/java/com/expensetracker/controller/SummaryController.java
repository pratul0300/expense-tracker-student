package com.expensetracker.controller;

import com.expensetracker.dto.CategoryBreakdownResponse;
import com.expensetracker.dto.MonthlySummaryResponse;
import com.expensetracker.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/summary")
public class SummaryController {

  private final ExpenseService expenseService;

  public SummaryController(ExpenseService expenseService) {
    this.expenseService = expenseService;
  }

  @GetMapping("/monthly")
  public MonthlySummaryResponse monthly(
      @RequestParam("year") Integer year, @RequestParam("month") Integer month) {
    validateYm(year, month);
    return expenseService.monthlySummary(year, month);
  }

  @GetMapping("/category")
  public CategoryBreakdownResponse categories(
      @RequestParam("year") Integer year, @RequestParam("month") Integer month) {
    validateYm(year, month);
    return expenseService.categoryBreakdown(year, month);
  }

  private static void validateYm(Integer year, Integer month) {
    if (year == null || month == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "year and month are required");
    }
    if (month < 1 || month > 12) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "month must be between 1 and 12");
    }
  }
}
