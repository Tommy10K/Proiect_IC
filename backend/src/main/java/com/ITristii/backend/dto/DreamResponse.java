package com.ITristii.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DreamResponse {
    private String interpretation;
    private LocalDate dreamDate;
}
