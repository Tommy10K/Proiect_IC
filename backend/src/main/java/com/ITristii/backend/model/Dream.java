package com.ITristii.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import com.ITristii.backend.model.User;

@Setter
@Getter
@Entity
public class Dream {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "dream_date", nullable = false)
    private LocalDate dreamDate;

    private String title;
    private String description;
    // …getters/setters…
}
