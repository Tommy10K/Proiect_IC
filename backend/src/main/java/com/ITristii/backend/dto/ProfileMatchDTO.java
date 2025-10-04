package com.ITristii.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProfileMatchDTO {
    private final String name;
    private final double similarity;
    private String description;
}