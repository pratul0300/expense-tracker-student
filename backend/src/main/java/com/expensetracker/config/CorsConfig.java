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
      @Value("${cors.allowed.origin-patterns}") String allowedPatternsCsv) {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        String[] patterns =
            Arrays.stream(allowedPatternsCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toArray(String[]::new);

        var chain =
            registry
                .addMapping("/api/**")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*");

        if (patterns.length == 0) {
          chain.allowedOriginPatterns("http://localhost:5173", "http://localhost:3000");
        } else {
          chain.allowedOriginPatterns(patterns);
        }
        chain.allowCredentials(false).maxAge(3600);
      }
    };
  }
}
