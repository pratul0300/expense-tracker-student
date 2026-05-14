package com.expensetracker.util;

import com.expensetracker.entity.Expense;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

public final class CsvExporter {

  private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE;

  private CsvExporter() {}

  public static byte[] toCsvBytes(List<Expense> expenses) {
    StringBuilder sb = new StringBuilder();
    sb.append("id,title,amount,category,category_label,date,description\n");
    for (Expense e : expenses) {
      sb.append(e.getId()).append(',');
      sb.append(escape(e.getTitle())).append(',');
      sb.append(e.getAmount() != null ? e.getAmount().toPlainString() : "").append(',');
      sb.append(e.getCategory() != null ? e.getCategory().name() : "").append(',');
      sb.append(
              escape(
                  e.getCategory() != null ? e.getCategory().getDisplayName() : ""))
          .append(',');
      sb.append(e.getDate() != null ? ISO.format(e.getDate()) : "").append(',');
      sb.append(escape(e.getDescription()));
      sb.append('\n');
    }
    return sb.toString().getBytes(StandardCharsets.UTF_8);
  }

  private static String escape(String raw) {
    String value = Objects.toString(raw, "");
    boolean needsQuotes = value.contains(",") || value.contains("\"") || value.contains("\n") || value.contains("\r");
    String escaped = value.replace("\"", "\"\"");
    return needsQuotes ? "\"" + escaped + "\"" : escaped;
  }

  public static BigDecimal sumAmounts(List<Expense> expenses) {
    return expenses.stream()
        .map(Expense::getAmount)
        .filter(Objects::nonNull)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }
}
