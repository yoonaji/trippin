package com.springboot.be.config;

import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@ConditionalOnProperty(name = "app.gcs.enabled", havingValue = "true")
@Configuration
public class GcsConfig {

    @Value("${app.gcs.project-id}")
    private String projectId;

    @Bean
    public Storage storage() throws IOException {
        // StorageOptions가 project-id를 사용하여 Storage 서비스 클라이언트를 빌드합니다.
        // 인증은 'Application Default Credentials' (ADC)를 통해 자동으로 처리됩니다.
        // (예: GOOGLE_APPLICATION_CREDENTIALS 환경 변수 또는 GCE 메타데이터 서버)
        return StorageOptions.newBuilder()
                .setProjectId(projectId)
                .build()
                .getService();
    }
}