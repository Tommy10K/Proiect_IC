package com.ITristii.backend.repository;

import com.ITristii.backend.model.Dream;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DreamRepository extends JpaRepository<Dream, Long> {
}