package com.expensetracker.config;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

  @Bean
  public WebMvcConfigurer corsConfigurer(
      @Value("${cors.allowed.origin-patterns:*}") String allowedPatternsCsv) {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        String raw = allowedPatternsCsv == null ? "" : allowedPatternsCsv.trim();

        var chain =
            registry
                .addMapping("/api/**")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);

        if (raw.isEmpty() || "*".equals(raw)) {
          chain.allowedOriginPatterns("*");
        } else {
          String[] patterns =
              Arrays.stream(raw.split(","))
                  .map(String::trim)
                  .filter(s -> !s.isEmpty())
                  .toArray(String[]::new);
          if (patterns.length == 0) {
            chain.allowedOriginPatterns("*");
          } else {
            chain.allowedOriginPatterns(patterns);
          }
        }
      }
    };
  }
}
