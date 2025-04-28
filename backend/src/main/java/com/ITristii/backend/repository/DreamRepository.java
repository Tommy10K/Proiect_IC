package com.ITristii.backend.repository;

import com.ITristii.backend.model.Dream;
import com.ITristii.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface DreamRepository extends JpaRepository<Dream, Long> {
    // find all dreams for a user, ordered by date:
    List<Dream> findAllByUserIdOrderByDreamDateDesc(Long userId);
    boolean existsByUserAndDreamDate(User user, LocalDate dreamDate);
    // optionally: find one dream by user/date:
    // Optional<Dream> findByUserIdAndDreamDate(Long userId, LocalDate date);
}