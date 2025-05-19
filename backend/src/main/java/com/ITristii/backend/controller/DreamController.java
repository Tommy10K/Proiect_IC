    package com.ITristii.backend.controller;

    import com.ITristii.backend.dto.DreamDTO;
    import com.ITristii.backend.dto.DreamResponse;
    import com.ITristii.backend.dto.InterpretRequest;
    import com.ITristii.backend.model.Dream;
    import com.ITristii.backend.model.User;
    import com.ITristii.backend.model.Tag;
    import com.ITristii.backend.repository.DreamRepository;
    import com.ITristii.backend.repository.UserRepository;
    import com.ITristii.backend.service.DreamAiService;
import com.ITristii.backend.service.DreamService;
import com.ITristii.backend.service.TagService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.Valid;
    import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.transaction.annotation.Transactional;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.server.ResponseStatusException;

    import java.security.Principal;
    import java.time.LocalDate;
    import java.util.*;
    import java.util.stream.Collectors;

    @RestController
    @RequestMapping("/api/dreams")
    @RequiredArgsConstructor
    public class DreamController {

        private final DreamRepository dreamRepository;
        private final UserRepository userRepository;
        private final DreamAiService dreamAiService;

        /** interpretare simplă (Home) */
        @PostMapping("/interpret")
        public ResponseEntity<DreamResponse> interpret(@RequestBody InterpretRequest req) {
                String text = Optional.ofNullable(req.getDescription()).orElse("");
                if (text.isBlank()) {
                return ResponseEntity.badRequest().build();
                }
                String interpretation = dreamAiService.interpretDream(text);
                LocalDate date = Optional.ofNullable(req.getDreamDate())
                                        .filter(d -> !d.isBlank())
                                        .map(LocalDate::parse)
                                        .orElse(LocalDate.now());
                return ResponseEntity.ok(new DreamResponse(
                req.getTitle(), 
                text, 
                interpretation, 
                date,
                Collections.emptyList() 
                ));
        }

        /** upsert + interpretare (Dashboard) */
        @PostMapping("/interpret-save")
        @Transactional
        public ResponseEntity<DreamResponse> interpretAndSave(
            @RequestBody InterpretRequest req,
             Principal principal
        ) {
            // 1. validate
            String desc = Optional.ofNullable(req.getDescription()).orElse("");
            if (desc == null || desc.isBlank()) return ResponseEntity.badRequest().build();

            LocalDate date = Optional.ofNullable(req.getDreamDate())
                    .filter(d -> !d.isBlank())
                    .map(LocalDate::parse)
                    .orElse(LocalDate.now());

            // 2. find user
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

            // 3. ai
            String interpretation = dreamAiService.interpretDream(desc);

            // 4. upsert
            Dream dream = dreamRepository.findByUserIdAndDreamDate(user.getId(), date)
                    .orElseGet(Dream::new);
            dream.setUser(user);
            dream.setDreamDate(date);
            dream.setTitle(req.getTitle());
            dream.setDescription(desc);
            dream.setInterpretation(interpretation);
            dreamRepository.save(dream);

            // 5. răspuns
            return ResponseEntity.ok(new DreamResponse(
                dream.getTitle(),
                dream.getDescription(),
                dream.getInterpretation(),
                dream.getDreamDate(),
                dream.getTags().stream().map(Tag::getName).toList() 
                ));
        }

        @GetMapping("/year/{year}")
        public Map<String, List<DreamResponse>> getYear(
                @PathVariable int year,
                Principal principal
        ) {
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

            // (opţional: filtrează după an dacă vrei)
            List<Dream> list = dreamRepository.findAllByUserIdOrderByDreamDateDesc(user.getId());

            return list.stream()
                    .collect(Collectors.groupingBy(
                            d -> d.getDreamDate().toString(),
                            Collectors.mapping(
                                    d -> new DreamResponse(
                                            d.getTitle(),
                                            d.getDescription(),
                                            d.getInterpretation(),
                                            d.getDreamDate(),
                                            d.getTags().stream().map(Tag::getName).toList()
                                    ),
                                    Collectors.toList()
                            )
                    ));
        }
        @GetMapping("/date/{date}")
        public ResponseEntity<DreamResponse> getByDate(
                @PathVariable String date,
                Principal principal
        ) {
            LocalDate ld = LocalDate.parse(date);
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

            Dream dream = dreamRepository
                    .findByUserIdAndDreamDate(user.getId(), ld)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

            DreamResponse resp = new DreamResponse(
                    dream.getTitle(),
                    dream.getDescription(),
                    dream.getInterpretation(),
                    dream.getDreamDate(),
                    dream.getTags().stream().map(Tag::getName).toList()
            );
            return ResponseEntity.ok(resp);
        }

        private final TagService tagService;
        private static final Logger log = LoggerFactory.getLogger(DreamService.class);
        /** create pentru jurnal (opțional) */
        @PostMapping
        public ResponseEntity<?> create(@RequestBody Dream dream, Principal principal) {
            User user = userRepository.findByUsername(principal.getName())
                .orElseThrow();
                dream.setUser(user);

                Tag noTags = tagService.getByNameOrThrow("no_tags");
                dream.setTags(Set.of(noTags));

                if (dreamRepository.existsByUserAndDreamDate(user, dream.getDreamDate())) {
                        String msg = "You already have a dream saved on " + dream.getDreamDate();
                        return ResponseEntity.status(HttpStatus.CONFLICT).body(msg);
                }
                return ResponseEntity.ok(dreamRepository.save(dream));
        }
    }
