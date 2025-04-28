package com.ITristii.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DreamDetailsResponse {
    private String title;
    private String description;
    private String interpretation;
    private String dreamDate;    // yyyy-MM-dd
}
