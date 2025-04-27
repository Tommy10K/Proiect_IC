package com.ITristii.backend.controller;

import com.ITristii.backend.dto.DreamRequest;
import com.ITristii.backend.dto.DreamResponse;
import com.ITristii.backend.model.Dream;
import com.ITristii.backend.model.User;
import com.ITristii.backend.repository.DreamRepository;
import com.ITristii.backend.repository.UserRepository;
import com.ITristii.backend.service.DreamAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/api/dreams", produces = MediaType.APPLICATION_JSON_VALUE)
public class DreamController {

    @Autowired private DreamAiService ai;
    @Autowired private DreamRepository dreamRepo;
    @Autowired private UserRepository userRepo;

    /** interpretează + salvează noul vis */
    @PostMapping("/interpret")
    public DreamResponse interpret(@RequestBody DreamRequest req,
                                   Authentication auth) {

        User user = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String interp = ai.interpretDream(req.getDream());

        Dream d = new Dream();
        d.setUser(user);
        d.setDreamDate(LocalDate.now());
        d.setDescription(req.getDream());
        d.setInterpretation(interp);
        dreamRepo.save(d);

        return new DreamResponse(interp, d.getDreamDate());
    }

    /** toate visele dintr-un an calendaristic pentru calendarul din frontend */
    @GetMapping("/year/{year}")
    public Map<LocalDate, List<DreamResponse>> year(@PathVariable int year,
                                                    Authentication auth) {

        User user = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end   = LocalDate.of(year, 12, 31);

        return dreamRepo
                .findByUserAndDreamDateBetweenOrderByDreamDateDesc(user, start, end)
                .stream()
                .collect(Collectors.groupingBy(
                        Dream::getDreamDate,
                        LinkedHashMap::new,           // păstrează ordinea cronologică
                        Collectors.mapping(
                                d -> new DreamResponse(d.getInterpretation(), d.getDreamDate()),
                                Collectors.toList()
                        )));
    }
}
