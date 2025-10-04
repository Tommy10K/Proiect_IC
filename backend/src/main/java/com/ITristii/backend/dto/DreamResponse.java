package com.ITristii.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DreamResponse {
    private Long id;
    private String title;
    private String description;
    private String interpretation;
    private LocalDate dreamDate;
    private List<String> tags;
}
