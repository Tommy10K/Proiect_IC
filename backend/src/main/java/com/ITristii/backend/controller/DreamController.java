package com.ITristii.backend.controller;

import com.ITristii.backend.model.Dream;
import com.ITristii.backend.model.User;
import com.ITristii.backend.repository.DreamRepository;
import com.ITristii.backend.repository.UserRepository;
import com.ITristii.backend.service.DreamAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping           // POST /api/dreams  (jurnal)
    public ResponseEntity<?> create(@RequestBody Dream dream,
                                    Authentication auth) {

        User user = userRepository
                .findByUsername(auth.getName())
                .orElseThrow();

        dream.setUser(user);  // atașăm userul logat

        /* === Verificăm dublura pe (user, data) =============== */
        if (dreamRepository.existsByUserAndDreamDate(user, dream.getDreamDate())) {
            String msg = "Ai deja un vis salvat la data " + dream.getDreamDate();
            return ResponseEntity.status(HttpStatus.CONFLICT).body(msg);
        }

        /* ===================================================== */
        return ResponseEntity.ok(dreamRepository.save(dream));
    }
}