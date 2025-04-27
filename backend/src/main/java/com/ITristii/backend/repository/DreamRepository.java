package com.ITristii.backend.repository;

import com.ITristii.backend.model.Dream;
import com.ITristii.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DreamRepository extends JpaRepository<Dream, Long> {
    // toate visele unui user, ordonate desc
    List<Dream> findByUserOrderByDreamDateDesc(User user);

    // visele pe o perioadă (pt. săptămâni/luni etc.)
    List<Dream> findByUserAndDreamDateBetweenOrderByDreamDateDesc(
            User user,
            LocalDate start,
            LocalDate end);
}