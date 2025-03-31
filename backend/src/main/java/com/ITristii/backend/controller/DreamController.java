package com.ITristii.backend.controller;

import com.ITristii.backend.model.Dream;
import com.ITristii.backend.repository.DreamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dreams")
public class DreamController {

    @Autowired
    private DreamRepository dreamRepository;

    @GetMapping
    public List<Dream> getAll() {
        return dreamRepository.findAll();
    }

    @PostMapping
    public Dream create(@RequestBody Dream dream) {
        return dreamRepository.save(dream);
    }
}
