package com.ITristii.backend.service;

import com.ITristii.backend.dto.DreamDTO;
import com.ITristii.backend.dto.UpdateDreamDTO;
import com.ITristii.backend.model.Dream;
import com.ITristii.backend.model.User;
import com.ITristii.backend.repository.DreamRepository;
import com.ITristii.backend.repository.UserRepository;
import com.ITristii.backend.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;
import com.ITristii.backend.model.Tag;

@Service
public class DreamService {

    private final DreamRepository dreamRepo;
    private final UserRepository userRepo;
    private final TagRepository tagRepo;
    private static final Logger log = LoggerFactory.getLogger(DreamService.class);

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

        Tag noTags = resolveTag("no_tags");
        log.info("DEBUG: resolveTag(\"no_tags\") → id={}", noTags.getId());

        Set<Tag> tagEntities = new HashSet<>();
        tagEntities.add(noTags);

        dream.setTags(tagEntities);

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

    @Transactional
    public Dream updateDream(Long dreamId, UpdateDreamDTO dto) {
        Dream dream = dreamRepo.findById(dreamId)
            .orElseThrow(() -> new IllegalArgumentException("Dream not found: " + dreamId));
        dream.setDreamDate(dto.getDreamDate());
        dream.setTitle(dto.getTitle());
        dream.setDescription(dto.getDescription());
        Set<Tag> tagEntities = new HashSet<>();
        for (String tagName : dto.getTags()) {
            Tag tag = resolveTag(tagName);
            tagEntities.add(tag);
        }
        if (tagEntities.isEmpty()) {
            Tag noTags = resolveTag("no_tags");
            tagEntities.add(noTags);
        }
        dream.setTags(tagEntities);
        return dreamRepo.save(dream);
    }

    @Transactional
    public void deleteDream(Long dreamId) {
        Dream dream = dreamRepo.findById(dreamId)
            .orElseThrow(() -> new IllegalArgumentException("Dream not found: " + dreamId));
        dreamRepo.delete(dream);
    }
}
