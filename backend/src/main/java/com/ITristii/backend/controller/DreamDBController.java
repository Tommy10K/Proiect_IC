// src/main/java/com/itristii/backend/controller/DreamDBController.java
package com.ITristii.backend.controller;

import com.ITristii.backend.dto.DreamDTO;
import com.ITristii.backend.model.Dream;
import com.ITristii.backend.service.DreamService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/db/dreams")
public class DreamDBController {
    private final DreamService dreamService;
    private static final Logger log = LoggerFactory.getLogger(DreamService.class);

    public DreamDBController(DreamService dreamService) {
        this.dreamService = dreamService;
    }

    @PostMapping
    public ResponseEntity<Dream> add(@Valid @RequestBody DreamDTO dto) {
        log.info("DEBUG: ADD");
        return ResponseEntity
          .status(201)
          .body(dreamService.createDream(dto));
    }

    @GetMapping("/user/{userId}")
    public List<Dream> list(@PathVariable Long userId) {
        return dreamService.getUserDreams(userId);
    }
}
