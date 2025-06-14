package com.ITristii.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = "name"))
public class Tag {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "emotional_tone", nullable = false)
    private int emotionalTone = 0;

    @Column(name = "rationality_creativity", nullable = false)
    private int rationalityCreativity = 0;

    @Column(name = "social_orientation", nullable = false)
    private int socialOrientation = 0;

    @Column(name = "activity_level", nullable = false)
    private int activityLevel = 0;

    @Column(name = "control_level", nullable = false)
    private int controlLevel = 0;
}

