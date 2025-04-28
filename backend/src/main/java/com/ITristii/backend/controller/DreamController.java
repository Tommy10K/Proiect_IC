package com.ITristii.backend.controller;

import com.ITristii.backend.dto.DreamRequest;
import com.ITristii.backend.dto.InterpretResponse;
import com.ITristii.backend.model.Dream;
import com.ITristii.backend.model.User;
import com.ITristii.backend.repository.DreamRepository;
import com.ITristii.backend.repository.UserRepository;
import com.ITristii.backend.service.DreamAiService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/dreams")
@RequiredArgsConstructor
public class DreamController {

    private final DreamRepository dreamRepository;
    private final UserRepository  userRepository;
    private final DreamAiService  dreamAiService;

    /*──────────────────────── interpret-only (HOME) ───────────────────────*/
    @PostMapping("/interpret")
    public ResponseEntity<InterpretResponse> interpret(@RequestBody @NotBlank String dream) {

        String interp = dreamAiService.interpretDream(dream);
        return ResponseEntity.ok(new InterpretResponse(interp, LocalDate.now().toString()));
    }

    /*────────────────── interpret + save (DASHBOARD) ─────────────────────*/
    @PostMapping("/interpret-save")
    @Transactional
    public ResponseEntity<InterpretResponse> interpretAndSave(@RequestBody DreamRequest req,
                                                              Authentication auth) {

        /* 1️⃣ validare şi date implicite */
        String description = Optional.ofNullable(req.getDescription())
                .orElse(req.getDream());
        if (description == null || description.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        LocalDate date = Optional.ofNullable(req.getDreamDate())
                .filter(d -> !d.isBlank())
                .map(LocalDate::parse)
                .orElse(LocalDate.now());

        /* 2️⃣ user curent */
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();

        /* 3️⃣ AI – interpretare */
        String interpretation = dreamAiService.interpretDream(description);

        /* 4️⃣ upsert pe (user, date) */
        Dream dream = dreamRepository
                .findByUserIdAndDreamDate(user.getId(), date)
                .orElseGet(Dream::new);

        dream.setUser(user);
        dream.setDreamDate(date);
        dream.setTitle(req.getTitle());
        dream.setDescription(description);
        dream.setInterpretation(interpretation);

        dreamRepository.save(dream);

        /* 5️⃣ răspuns */
        return ResponseEntity.ok(new InterpretResponse(interpretation, date.toString()));
    }

    /*──────────────────────────── create / update (Journal) ───────────────*/
    @PostMapping                //  POST /api/dreams
    @Transactional
    public ResponseEntity<Dream> createOrUpdate(@RequestBody DreamRequest req,
                                                Authentication auth) {

        /* pregătim valorile cerute */
        String description = Optional.ofNullable(req.getDescription())
                .orElse(req.getDream());
        if (description == null || description.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        LocalDate date = Optional.ofNullable(req.getDreamDate())
                .filter(d -> !d.isBlank())
                .map(LocalDate::parse)
                .orElse(LocalDate.now());

        User user = userRepository.findByUsername(auth.getName()).orElseThrow();

        /* căutăm dacă există deja un vis la data respectivă */
        Dream dream = dreamRepository
                .findByUserIdAndDreamDate(user.getId(), date)
                .orElseGet(Dream::new);

        dream.setUser(user);
        dream.setDreamDate(date);
        dream.setTitle(req.getTitle());
        dream.setDescription(description);

        /* dacă nu are interpretare (ex.: pacientul scrie din jurnal),
           putem eventual să o generăm aici – depinde de fluxul tău.
           În exemplu NU chemăm AI-ul pentru că e rută “manuală”.        */

        return ResponseEntity.ok(dreamRepository.save(dream));
    }
}
