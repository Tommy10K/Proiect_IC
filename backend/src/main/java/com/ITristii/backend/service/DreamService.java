package com.ITristii.backend.service;

import com.ITristii.backend.dto.DreamDTO;
import com.ITristii.backend.model.Dream;
import com.ITristii.backend.model.User;
import com.ITristii.backend.repository.DreamRepository;
import com.ITristii.backend.repository.UserRepository;
import com.ITristii.backend.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;
import com.ITristii.backend.model.Tag;

@Service
public class DreamService {

    private final DreamRepository dreamRepo;
    private final UserRepository userRepo;
    private final TagRepository tagRepo;

    public DreamService(DreamRepository dreamRepo, UserRepository userRepo, TagRepository tagRepo) {
        this.dreamRepo = dreamRepo;
        this.userRepo = userRepo;
        this.tagRepo = tagRepo;
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

        if (dto.getTags() != null && dto.getTags().size() > 5) {
            throw new IllegalArgumentException("A dream can have at most 5 tags");
        }

        if (dto.getTags() != null) {
            Set<Tag> tagEntities = dto.getTags().stream()
                .map(this::resolveTag)     // helper below
                .collect(Collectors.toSet());
            dream.setTags(tagEntities);
        }

        return dreamRepo.save(dream);
    }

    private Tag resolveTag(String name) {
    return tagRepo.findByName(name.trim().toLowerCase())
                  .orElseThrow(() ->
                      new IllegalArgumentException("Unknown tag: " + name));
    }

    @Transactional(readOnly = true)
    public List<Dream> getUserDreams(Long userId) {
        return dreamRepo.findAllByUserIdOrderByDreamDateDesc(userId);
    }
}
