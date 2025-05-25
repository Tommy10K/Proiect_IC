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
import java.util.Arrays;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.Collections;

@Service
public class DreamAiService {

    @Value("${huggingface.api.url}")
    private String apiUrl;

    @Value("${huggingface.api.key}")
    private String apiKey;

    private final ObjectMapper json = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(DreamAiService.class);

    public List<String> chooseTagsMock(String dream) {
        // hard-code whatever tags already exist in your DB:
        return List.of("lucid", "nightmare");
    }

    public List<String> chooseTags(String dream, List<String> allTags) {
        RestTemplate rest = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        // 1. Build prompt
        String tagList = String.join(", ", allTags);
        String prompt = """
            ### Instruction:
            Choose between 1 and 5 tags for the following dream.
            Only select from this list: %s.
            Provide your answer *only* as a JSON array of strings (e.g. ["tag1","tag2"]).

            ### Dream:
            %s

            ### Tags:
            """.formatted(tagList, dream);

        Map<String,String> body = Map.of("inputs", prompt);
        HttpEntity<Map<String,String>> request = new HttpEntity<>(body, headers);

        // 2. Call HF inference API
        String response;
        try {
            response = rest.postForEntity(apiUrl, request, String.class).getBody();
        } catch (Exception ex) {
            log.error("chooseTags: API request failed", ex);
            return Collections.emptyList();
        }

        if (response == null) return Collections.emptyList();

        try {
            // 1. parse the wrapper JSON into a List of Maps
            List<Map<String, String>> hf = json.readValue(
                response,
                new TypeReference<List<Map<String,String>>>() {}
            );

            // 2. extract the generated_text
            String gen = hf.get(0).get("generated_text");
            log.debug("chooseTags: generated_text → {}", gen);
            if (gen == null) return Collections.emptyList();

            // 3. find your marker
            int idx = gen.indexOf("### Tags:");
            if (idx == -1) return Collections.emptyList();

            String out = gen.substring(idx + "### Tags:".length()).trim();

            // 4. parse that substring as JSON array
            return json.readValue(out, new TypeReference<List<String>>() {});

        } catch (Exception e) {
            log.error("chooseTags: failed to parse AI response", e);
            return Collections.emptyList();
        }
    }

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
            log.error("Interpret dream failed", e);
            return "Eroare la interpretarea visului: " + e.getMessage();
        }
    }
}