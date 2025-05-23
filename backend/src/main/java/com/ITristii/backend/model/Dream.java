package com.ITristii.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.ITristii.backend.model.User;

@Setter
@Getter
@Entity
public class Dream {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "dream_date", nullable = false)
    private LocalDate dreamDate;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(columnDefinition = "text")
    private String interpretation;

    @ManyToMany(fetch = FetchType.EAGER,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "dream_tags",
           joinColumns = @JoinColumn(name = "dream_id"),
           inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tags = new HashSet<>();
}
