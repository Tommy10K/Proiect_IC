package com.ITristii.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;
import java.util.Collections;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DreamAiService {

    @Value("${huggingface.api.url}")
    private String apiUrl;

    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.model:meta-llama/Llama-3.1-8B-Instruct}")
    private String hfModel;

    private final ObjectMapper json = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(DreamAiService.class);

    public List<String> chooseTagsMock(String dream) {
        return List.of("lucid", "nightmare");
    }

    /**
     * Versiunea care folosește HF Router (OpenAI-compatible /chat/completions).
     * Îi cerem STRICT JSON (array de stringuri) ca răspuns.
     */
    public List<String> chooseTags(String dream, List<String> allTags) {
        try {
            RestTemplate rest = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            // normalizăm lista permisă la lower-case
            final List<String> allowedLower = allTags.stream()
                    .map(s -> s == null ? "" : s.trim().toLowerCase())
                    .filter(s -> !s.isEmpty())
                    .distinct()
                    .collect(Collectors.toList());

            String tagList = String.join(", ", allowedLower);

            String systemPrompt = "You select between 1 and 5 tags from a FIXED list. "
                    + "Respond with JSON ONLY: a plain JSON array of strings (no prose, no markdown). "
                    + "Use ONLY tags from the allowed list. If none apply, return [\"no_tags\"].";

            String userPrompt = """
                Choose tags for this dream.
                Allowed tags: %s

                Dream:
                %s

                Return ONLY a JSON array of strings, e.g. ["tag1","tag2"].
                """.formatted(tagList, dream);

            Map<String, Object> body = Map.of(
                    "model", hfModel,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userPrompt)
                    ),
                    "temperature", 0,
                    "max_tokens", 128
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> resp = rest.postForEntity(apiUrl, request, String.class);

            if (!resp.getStatusCode().is2xxSuccessful() || resp.getBody() == null) {
                log.error("chooseTags: non-2xx status={} body={}", resp.getStatusCodeValue(), resp.getBody());
                return List.of("no_tags");
            }

            Map<String, Object> parsed = json.readValue(resp.getBody(), new TypeReference<>() {});
            List<?> choices = (List<?>) parsed.get("choices");
            if (choices == null || choices.isEmpty()) return List.of("no_tags");

            Map<?, ?> first = (Map<?, ?>) choices.get(0);
            Map<?, ?> message = (Map<?, ?>) first.get("message");
            String content = message != null ? (String) message.get("content") : null;
            if (content == null || content.isBlank()) return List.of("no_tags");

            // încearcă să parsezi direct ca JSON array
            List<String> raw = json.readValue(content, new TypeReference<List<String>>() {});

            // normalizare + filtrare strictă la lista permisă
            List<String> cleaned = raw.stream()
                    .filter(s -> s != null)
                    .map(s -> s.trim().toLowerCase())
                    .filter(s -> !s.isEmpty())
                    .filter(allowedLower::contains)  // <- aici blocăm "running" dacă nu există în DB
                    .distinct()
                    .limit(5)
                    .collect(Collectors.toList());

            if (cleaned.isEmpty()) return List.of("no_tags");
            return cleaned;

        } catch (Exception e) {
            log.error("chooseTags: failed", e);
            return List.of("no_tags");
        }
    }

    /**
     * Interpretare vis prin HF Router (OpenAI-compatible /chat/completions).
     */
    public String interpretDream(String dream) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            String systemPrompt = "You are an expert dream interpreter. Be concise and clear.";
            String userPrompt = "Interpret this dream:\n" + dream;

            Map<String, Object> body = Map.of(
                    "model", hfModel,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userPrompt)
                    ),
                    "temperature", 0.2,
                    "max_tokens", 512
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.error("interpretDream: non-2xx status={} body={}", response.getStatusCodeValue(), response.getBody());
                return "Interpretation not available.";
            }

            Map<String, Object> parsed = json.readValue(response.getBody(), new TypeReference<>() {});
            List<?> choices = (List<?>) parsed.get("choices");
            if (choices == null || choices.isEmpty()) return "Interpretation not available.";

            Map<?, ?> first = (Map<?, ?>) choices.get(0);
            Map<?, ?> message = (Map<?, ?>) first.get("message");
            String content = message != null ? (String) message.get("content") : null;

            if (content == null || content.isBlank()) return "Interpretation not available.";

            // Cleanup foarte ușor (dacă vrei să eviți markdown)
            String interpretation = content
                    .replaceAll("[\\r\\n]+", " ")
                    .trim();

            return interpretation.isBlank() ? "Interpretation not available." : interpretation;
        } catch (Exception e) {
            log.error("Interpret dream failed", e);
            return "Eroare la interpretarea visului: " + e.getMessage();
        }
    }
}
