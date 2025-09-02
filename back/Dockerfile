# 1단계: Gradle 빌드
FROM gradle:8.7-jdk17 AS builder
WORKDIR /app
COPY . .
RUN gradle clean build -x test

# 2단계: 실행용 이미지
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
