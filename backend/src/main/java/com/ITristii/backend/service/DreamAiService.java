package com.ITristii.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class DreamAiService {

    @Value("${huggingface.api.url}")
    private String apiUrl;

    @Value("${huggingface.api.key}")
    private String apiKey;

    public String interpretDream(String dream) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            Map<String, String> body = Map.of(
                    "inputs", "### Instruction:\nGive a dream interpretation for the following dream.\n\n### Dream:\n" + dream + "\n\n### Interpretation:"
            );

            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

            String json = response.getBody();
            if (json.contains("generated_text")) {
                int start = json.indexOf("### Interpretation:");
                if (start != -1) {
                    String interpretation = json.substring(start + "### Interpretation:".length());

                    interpretation = interpretation
                            .replaceAll("[\\n\\r]+", " ")
                            .replaceAll("\\\\n", " ")
                            .replaceAll("[\\[\\]{}\"]", "")
                            .trim();

                    return interpretation;
                }
            }

            return "Interpretation not available.";
        } catch (Exception e) {
            return "Eroare la interpretarea visului: " + e.getMessage();
        }
    }
}