package com.expensetracker.repository;

import com.expensetracker.entity.Expense;
import com.expensetracker.entity.ExpenseCategory;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class ExpenseSpecifications {

  private ExpenseSpecifications() {}

  public static Specification<Expense> filtered(Integer year, Integer month, ExpenseCategory category) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      LocalDate start = ExpenseSpecifications.startInclusive(year, month);
      LocalDate end = ExpenseSpecifications.endInclusive(year, month);

      if (start != null && end != null) {
        predicates.add(cb.between(root.get("date"), start, end));
      }

      if (category != null) {
        predicates.add(cb.equal(root.get("category"), category));
      }

      return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(Predicate[]::new));
    };
  }

  private static LocalDate startInclusive(Integer year, Integer month) {
    if (year == null && month == null) {
      return null;
    }
    int resolvedYear = (year != null) ? year : LocalDate.now().getYear();

    if (month != null) {
      LocalDate day = LocalDate.of(resolvedYear, month, 1);
      return day;
    }

    return LocalDate.of(resolvedYear, 1, 1);
  }

  private static LocalDate endInclusive(Integer year, Integer month) {
    if (year == null && month == null) {
      return null;
    }

    int resolvedYear = (year != null) ? year : LocalDate.now().getYear();

    if (month != null) {
      LocalDate first = LocalDate.of(resolvedYear, month, 1);
      return first.withDayOfMonth(first.lengthOfMonth());
    }

    return LocalDate.of(resolvedYear, 12, 31);
  }
}
