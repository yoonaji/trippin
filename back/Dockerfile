# 1단계: Gradle 빌드
FROM gradle:8.7-jdk17-jammy AS builder
WORKDIR /app
COPY . .
RUN gradle clean bootJar -x test

# 2단계: 실행
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/BE-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
