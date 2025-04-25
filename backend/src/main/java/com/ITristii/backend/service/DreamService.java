package com.ITristii.backend.service;

import com.ITristii.backend.dto.DreamDTO;
import com.ITristii.backend.model.Dream;
import com.ITristii.backend.model.User;
import com.ITristii.backend.repository.DreamRepository;
import com.ITristii.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class DreamService {

    private final DreamRepository dreamRepo;
    private final UserRepository userRepo;

    public DreamService(DreamRepository dreamRepo, UserRepository userRepo) {
        this.dreamRepo = dreamRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public Dream createDream(DreamDTO dto) {
        User user = userRepo.findById(dto.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + dto.getUserId()));

        Dream dream = new Dream();
        dream.setUser(user);
        dream.setDreamDate(dto.getDreamDate());
        dream.setTitle(dto.getTitle());
        dream.setDescription(dto.getDescription());

        return dreamRepo.save(dream);
    }

    @Transactional(readOnly = true)
    public List<Dream> getUserDreams(Long userId) {
        return dreamRepo.findAllByUserIdOrderByDreamDateDesc(userId);
    }
}
