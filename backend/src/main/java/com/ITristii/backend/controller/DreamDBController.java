// src/main/java/com/itristii/backend/controller/DreamDBController.java
package com.ITristii.backend.controller;

import com.ITristii.backend.dto.DreamDTO;
import com.ITristii.backend.model.Dream;
import com.ITristii.backend.service.DreamService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/db/dreams")
public class DreamDBController {
    private final DreamService dreamService;

    public DreamDBController(DreamService dreamService) {
        this.dreamService = dreamService;
    }

    @PostMapping
    public ResponseEntity<Dream> add(@Valid @RequestBody DreamDTO dto) {
        return ResponseEntity
          .status(201)
          .body(dreamService.createDream(dto));
    }

    @GetMapping("/user/{userId}")
    public List<Dream> list(@PathVariable Long userId) {
        return dreamService.getUserDreams(userId);
    }
}
