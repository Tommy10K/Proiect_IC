package com.ITristii.backend.service;

import com.ITristii.backend.model.Tag;
import com.ITristii.backend.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepo;

    public List<String> allTagNames() {
        return tagRepo.findAll()
                      .stream()
                      .map(Tag::getName)
                      .toList();
    }

    public Tag getByNameOrThrow(String name) {
        return tagRepo.findByName(name.toLowerCase())
                      .orElseThrow(() ->
                          new IllegalArgumentException("Unknown tag: " + name));
    }

    public Set<Tag> toEntities(Collection<String> names) {
        return names.stream()
                    .map(this::getByNameOrThrow)
                    .collect(Collectors.toSet());
    }
}

