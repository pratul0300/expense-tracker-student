package com.expensetracker.service;

import com.expensetracker.dto.CategoryBreakdownResponse;
import com.expensetracker.dto.CategoryTotalResponse;
import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.dto.MonthlySummaryResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.ExpenseCategory;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.ExpenseSpecifications;
import com.expensetracker.util.CsvExporter;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.Comparator;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ExpenseService {

  private final ExpenseRepository expenseRepository;

  public ExpenseService(ExpenseRepository expenseRepository) {
    this.expenseRepository = expenseRepository;
  }


  @Transactional(Transactional.TxType.SUPPORTS)
  public ExpenseResponse getById(Long id) {
    Expense entity =
        expenseRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));
    return ExpenseResponse.from(entity);
  }

  @Transactional(Transactional.TxType.SUPPORTS)
  public List<ExpenseResponse> list(Integer year, Integer month, ExpenseCategory category) {
    return filteredEntities(year, month, category).stream()
        .sorted(Comparator.comparing(Expense::getDate).reversed())
        .map(ExpenseResponse::from)
        .toList();
  }

  @Transactional
  public ExpenseResponse create(ExpenseRequest request) {
    Expense entity =
        new Expense(
            request.getTitle(),
            request.getAmount(),
            request.getCategory(),
            request.getDate(),
            request.getDescription());
    expenseRepository.save(entity);
    return ExpenseResponse.from(entity);
  }

  @Transactional
  public ExpenseResponse update(Long id, ExpenseRequest request) {
    Expense entity =
        expenseRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));
    entity.setTitle(request.getTitle());
    entity.setAmount(request.getAmount());
    entity.setCategory(request.getCategory());
    entity.setDate(request.getDate());
    entity.setDescription(request.getDescription());
    expenseRepository.save(entity);
    return ExpenseResponse.from(entity);
  }

  @Transactional
  public void delete(Long id) {
    Expense entity =
        expenseRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));
    expenseRepository.delete(entity);
  }

  @Transactional(Transactional.TxType.SUPPORTS)
  public MonthlySummaryResponse monthlySummary(int year, int month) {
    List<Expense> rows = filteredEntities(year, month, null);
    BigDecimal total = CsvExporter.sumAmounts(rows);
    return new MonthlySummaryResponse(year, month, total);
  }

  @Transactional(Transactional.TxType.SUPPORTS)
  public CategoryBreakdownResponse categoryBreakdown(int year, int month) {
    List<Expense> rows = filteredEntities(year, month, null);

    EnumMap<ExpenseCategory, BigDecimal> totals = new EnumMap<>(ExpenseCategory.class);
    for (Expense e : rows) {
      totals.merge(e.getCategory(), e.getAmount(), BigDecimal::add);
    }

    BigDecimal monthTotal = CsvExporter.sumAmounts(rows);

    List<CategoryTotalResponse> list =
        Arrays.stream(ExpenseCategory.values())
            .map(
                cat ->
                    new CategoryTotalResponse(
                        cat, cat.getDisplayName(), totals.getOrDefault(cat, BigDecimal.ZERO)))
            .sorted(Comparator.comparing((CategoryTotalResponse r) -> r.total()).reversed())
            .toList();

    return new CategoryBreakdownResponse(year, month, monthTotal, list);
  }

  @Transactional(Transactional.TxType.SUPPORTS)
  public byte[] exportCsv(Integer year, Integer month, ExpenseCategory category) {
    List<Expense> rows = filteredEntities(year, month, category);
    rows.sort(Comparator.comparing(Expense::getDate).reversed());
    return CsvExporter.toCsvBytes(rows);
  }

  private List<Expense> filteredEntities(Integer year, Integer month, ExpenseCategory category) {
    var specification = ExpenseSpecifications.filtered(year, month, category);
    return expenseRepository.findAll(specification, Sort.by(Sort.Direction.DESC, "date"));
  }
}

