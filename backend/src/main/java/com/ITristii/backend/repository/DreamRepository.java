package com.ITristii.backend.repository;

import com.ITristii.backend.model.Dream;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface DreamRepository extends JpaRepository<Dream, Long> {
    // find all dreams for a user, ordered by date:
    List<Dream> findAllByUserIdOrderByDreamDateDesc(Long userId);

    // optionally: find one dream by user/date:
    // Optional<Dream> findByUserIdAndDreamDate(Long userId, LocalDate date);
}