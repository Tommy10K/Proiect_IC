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
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ------------- relație user ------------ */
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")           // coloana user_id în tabelă
    private User user;

    /* ------------- câmpuri vis ------------- */
    @Column(name = "dream_date", nullable = false)
    private LocalDate dreamDate;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "text")
    private String description;
}
