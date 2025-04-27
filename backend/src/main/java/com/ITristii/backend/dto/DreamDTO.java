package com.ITristii.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class DreamDTO {

    @NotNull
    private Long userId;           // who this dream belongs to

    @NotNull
    private LocalDate dreamDate;   // date of the dream

    @NotNull @Size(min = 1, max = 255)
    private String title;          // short title

    @Size(max = 2000)
    private String description;    // full text (optional)

    // ─── Getters & Setters ───────────────────────────────────────────────────

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getDreamDate() {
        return dreamDate;
    }
    public void setDreamDate(LocalDate dreamDate) {
        this.dreamDate = dreamDate;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
}
