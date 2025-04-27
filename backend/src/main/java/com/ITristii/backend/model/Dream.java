package com.ITristii.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
@Entity
@Table(name = "dreams")
public class Dream {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* câmpurile existente – nu le atingem */
    private String title;
    private String description;

    /* 🔹 NOU – userul căruia îi aparține visul */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    /* 🔹 NOU – data calendaristică a visului */
    @Column(name = "dream_date", nullable = false)
    private LocalDate dreamDate;

    /* 🔹 NOU – interpretarea AI */
    @Column(columnDefinition = "TEXT")
    private String interpretation;

    /* creat automat */
    @CreationTimestamp
    private LocalDateTime createdAt;
}
