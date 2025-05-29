package com.ITristii.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import lombok.RequiredArgsConstructor;
import java.util.List;

import com.ITristii.backend.service.ProfileService;
import com.ITristii.backend.dto.ProfileMatchDTO;
import com.ITristii.backend.dto.UserDreamProfileDTO;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping("/user/{userId}")
    public UserDreamProfileDTO getProfile(@PathVariable Long userId) {
        return profileService.calculateUserProfile(userId);
    }

    @GetMapping("/match/user/{userId}")
    public List<ProfileMatchDTO> match(@PathVariable Long userId) {
        return profileService.matchUserToArchetypes(userId);
    }
}
