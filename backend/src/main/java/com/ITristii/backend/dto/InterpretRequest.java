// src/main/java/com/ITristii/backend/dto/InterpretRequest.java
package com.ITristii.backend.dto;

import lombok.Data;

@Data
public class InterpretRequest {
    private String title;        // opțional
    private String description;  // textul visului
    private String dreamDate;    // opțional (yyyy-MM-dd); dacă lipsește -> azi
}
