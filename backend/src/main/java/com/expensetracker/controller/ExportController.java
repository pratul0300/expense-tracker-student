package com.expensetracker.controller;

import com.expensetracker.entity.ExpenseCategory;
import com.expensetracker.service.ExpenseService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/export")
public class ExportController {

  private final ExpenseService expenseService;

  public ExportController(ExpenseService expenseService) {
    this.expenseService = expenseService;
  }

  @GetMapping("/csv")
  public ResponseEntity<byte[]> exportCsv(
      @RequestParam(required = false) Integer year,
      @RequestParam(required = false) Integer month,
      @RequestParam(required = false) ExpenseCategory category) {
    byte[] bytes = expenseService.exportCsv(year, month, category);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentDisposition(
        ContentDisposition.attachment().filename("expenses.csv").build());
    headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));

    return ResponseEntity.ok().headers(headers).body(bytes);
  }
}
