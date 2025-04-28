package com.ITristii.backend.controller;

import com.ITristii.backend.model.Dream;
import com.ITristii.backend.model.User;
import com.ITristii.backend.repository.DreamRepository;
import com.ITristii.backend.repository.UserRepository;
import com.ITristii.backend.service.DreamAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dreams")
public class DreamController {

    @Autowired
    private DreamRepository dreamRepository;

    @Autowired
    private DreamAiService dreamAiService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/interpret")
    public String interpret(@RequestBody Map<String, String> body) {
        String dreamText = body.get("dream");
        return dreamAiService.interpretDream(dreamText);
    }

    @GetMapping
    public List<Dream> getAll() {
        return dreamRepository.findAll();
    }

    @PostMapping
    public Dream create(@RequestBody Dream dream, Authentication auth) {
        User user = userRepository
                .findByUsername(auth.getName())
                .orElseThrow();

        dream.setUser(user);                 // 👈  atașăm userul autenticat
        return dreamRepository.save(dream);
    }
}