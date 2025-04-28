package com.ITristii.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InterpretResponse {
    private String interpretation;
    private String dreamDate;
}