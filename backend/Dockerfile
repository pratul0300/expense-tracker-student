# Multi-stage build: Java 21, Spring Boot executable JAR
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw -q clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xmx512m -XX:+ExitOnOutOfMemoryError"
COPY --from=build /app/target/expense-tracker-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
# Fly routes HTTPS to internal PORT; Spring reads server.port=${PORT} from application-prod.properties
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
