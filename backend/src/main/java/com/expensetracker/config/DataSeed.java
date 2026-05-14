package com.expensetracker.config;

import com.expensetracker.entity.Expense;
import com.expensetracker.entity.ExpenseCategory;
import com.expensetracker.repository.ExpenseRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeed implements CommandLineRunner {

  private final ExpenseRepository expenseRepository;

  public DataSeed(ExpenseRepository expenseRepository) {
    this.expenseRepository = expenseRepository;
  }

  @Override
  public void run(String... args) {
    if (expenseRepository.count() > 0) {
      return;
    }

    LocalDate may = LocalDate.of(2026, 5, 1);
    LocalDate apr = LocalDate.of(2026, 4, 10);

    List<Expense> seed =
        List.of(
            new Expense(
                "Campus dining plan top-up",
                new BigDecimal("120.00"),
                ExpenseCategory.FOOD,
                may.withDayOfMonth(2),
                "Monthly meal plan reload"),
            new Expense(
                "Weekly groceries",
                new BigDecimal("54.35"),
                ExpenseCategory.FOOD,
                may.withDayOfMonth(6),
                "Trader Joe's run"),
            new Expense(
                "Bus pass",
                new BigDecimal("35.00"),
                ExpenseCategory.TRAVEL,
                may.withDayOfMonth(3),
                "City transit monthly pass"),
            new Expense(
                "Uber to study group",
                new BigDecimal("18.70"),
                ExpenseCategory.TRAVEL,
                may.withDayOfMonth(9),
                "Late night ride home"),
            new Expense(
                "Textbooks",
                new BigDecimal("129.99"),
                ExpenseCategory.SHOPPING,
                apr,
                "Spring semester required reading"),
            new Expense(
                "Laptop accessories",
                new BigDecimal("42.50"),
                ExpenseCategory.SHOPPING,
                may.withDayOfMonth(11),
                "USB-C hub + mouse pad"),
            new Expense(
                "Electric bill",
                new BigDecimal("62.10"),
                ExpenseCategory.BILLS,
                may.withDayOfMonth(5),
                "Shared apartment utilities"),
            new Expense(
                "Phone plan",
                new BigDecimal("45.00"),
                ExpenseCategory.BILLS,
                may.withDayOfMonth(1),
                "Prepaid mobile"),
            new Expense(
                "Concert tickets",
                new BigDecimal("75.00"),
                ExpenseCategory.ENTERTAINMENT,
                may.withDayOfMonth(14),
                "Campus band night"),
            new Expense(
                "Movie night",
                new BigDecimal("22.40"),
                ExpenseCategory.ENTERTAINMENT,
                may.withDayOfMonth(7),
                "Tickets + snacks"),
            new Expense(
                "Club membership",
                new BigDecimal("15.00"),
                ExpenseCategory.OTHER,
                may.withDayOfMonth(4),
                "Photography club dues"),
            new Expense(
                "Printing & stationery",
                new BigDecimal("9.25"),
                ExpenseCategory.OTHER,
                may.withDayOfMonth(8),
                "Poster printing for project"));

    expenseRepository.saveAll(seed);
  }
}
