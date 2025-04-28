package com.ITristii.backend.dto;

import lombok.Data;

@Data
public class DreamRequest {
    private String dream;
    // câmpuri noi – denumirile trebuie să coincidă cu JSON-ul trimis din front
    private String title;          // opțional
    private String description;    // textul visului – REQUIRED
    private String dreamDate;
}
