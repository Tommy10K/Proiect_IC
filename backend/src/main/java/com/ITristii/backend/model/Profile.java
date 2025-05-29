package com.ITristii.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "profile")
@Getter @Setter
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(name = "emotional_tone", nullable = false)
    private int emotionalTone;

    @Column(name = "rationality_creativity", nullable = false)
    private int rationalityCreativity;

    @Column(name = "social_orientation", nullable = false)
    private int socialOrientation;

    @Column(name = "activity_level", nullable = false)
    private int activityLevel;

    @Column(name = "control_level", nullable = false)
    private int controlLevel;
}
