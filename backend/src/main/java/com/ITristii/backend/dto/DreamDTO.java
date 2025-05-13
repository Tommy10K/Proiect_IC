package com.ITristii.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

import java.time.LocalDate;

@Setter
@Getter
public class DreamDTO {

    @NotNull
    private Long userId;           // who this dream belongs to

    @NotNull
    private LocalDate dreamDate;   // date of the dream

    @NotNull @Size(min = 1, max = 255)
    private String title;          // short title

    @Size(max = 2000)
    private String description;    // full text (optional)

    @NotNull
    @Size(max = 5)
    private List<String> tags;
}
