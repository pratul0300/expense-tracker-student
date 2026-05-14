package com.expensetracker.env;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

/**
 * Maps Render-style {@code DATABASE_URL} ({@code postgres://}… ) into {@code spring.datasource.*}
 * under the {@code prod} profile whenever no non-H2 JDBC URL is already configured.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

  private static final String SOURCE_NAME = "expense-tracker-render-database-url";

  @Override
  public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
    String activeProfiles =
        environment.getProperty("SPRING_PROFILES_ACTIVE", environment.getProperty("spring.profiles.active", ""));
    if (!activeProfiles.toLowerCase().contains("prod")) {
      return;
    }

    String existingUrl = environment.getProperty("spring.datasource.url");
    boolean hasNonH2Url =
        existingUrl != null
            && !existingUrl.isBlank()
            && !existingUrl.regionMatches(true, 0, "jdbc:h2:", 0, "jdbc:h2:".length());
    if (hasNonH2Url) {
      return;
    }

    String databaseUrl = environment.getProperty("DATABASE_URL");
    if (databaseUrl == null || databaseUrl.isBlank()) {
      return;
    }

    ParsedJdbc parsed;
    try {
      parsed = parseDatabaseUrl(databaseUrl.trim());
    } catch (RuntimeException ex) {
      return;
    }

    Map<String, Object> props = new HashMap<>();
    props.put("spring.datasource.url", parsed.jdbcUrl);
    props.put("spring.datasource.username", parsed.username);
    props.put("spring.datasource.password", parsed.password);
    props.put("spring.datasource.driver-class-name", "org.postgresql.Driver");

    environment.getPropertySources().addFirst(new MapPropertySource(SOURCE_NAME, props));
  }

  private static ParsedJdbc parseDatabaseUrl(String url) {
    String normalized = url.startsWith("postgres://") ? url.replaceFirst("^postgres:", "postgresql:") : url;

    URI uri = URI.create(normalized);
    if (!"postgresql".equalsIgnoreCase(uri.getScheme())) {
      throw new IllegalArgumentException("unsupported scheme");
    }

    String rawUserInfo = uri.getRawUserInfo();
    String username = "";
    String password = "";
    if (rawUserInfo != null && !rawUserInfo.isBlank()) {
      String decoded = URLDecoder.decode(rawUserInfo, StandardCharsets.UTF_8);
      int sep = decoded.indexOf(':');
      if (sep >= 0) {
        username = decoded.substring(0, sep);
        password = decoded.substring(sep + 1);
      } else {
        username = decoded;
      }
    }

    String host = uri.getHost();
    if (host == null || host.isBlank()) {
      throw new IllegalArgumentException("missing host");
    }
    int port = uri.getPort();
    String path = uri.getPath();

    StringBuilder jdbc = new StringBuilder("jdbc:postgresql://").append(host);
    if (port != -1) {
      jdbc.append(':').append(port);
    }

    String database = "";
    if (path != null && path.length() > 1) {
      database = path.substring(1);
    }
    if (database.isBlank()) {
      throw new IllegalArgumentException("missing database name in path");
    }
    jdbc.append('/').append(database);

    if (uri.getRawQuery() != null && !uri.getRawQuery().isBlank()) {
      jdbc.append('?').append(uri.getRawQuery());
    }

    return new ParsedJdbc(jdbc.toString(), username, password);
  }

  private record ParsedJdbc(String jdbcUrl, String username, String password) {}
}
