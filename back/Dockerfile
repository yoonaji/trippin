# 1단계: Gradle 빌드
FROM gradle:8.7-jdk17-jammy AS builder
WORKDIR /app
COPY . .
RUN gradle clean build -x test && cp build/libs/*.jar build/libs/app.jar


# 2단계: 실행용 이미지
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/app.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
