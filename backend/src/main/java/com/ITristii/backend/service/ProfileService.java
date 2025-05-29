package com.ITristii.backend.service;

import org.springframework.stereotype.Service;

import com.ITristii.backend.repository.DreamRepository;
import com.ITristii.backend.repository.TagRepository;
import com.ITristii.backend.model.Dream;
import com.ITristii.backend.model.Tag;
import com.ITristii.backend.dto.ProfileMatchDTO;
import com.ITristii.backend.dto.UserDreamProfileDTO;
import com.ITristii.backend.model.Profile;
import com.ITristii.backend.repository.ProfileRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
public class ProfileService {
    private final DreamRepository dreamRepo;
    private final ProfileRepository profileRepo;

    public ProfileService(DreamRepository dreamRepo, ProfileRepository profileRepo) {
        this.dreamRepo = dreamRepo;
        this.profileRepo = profileRepo;
    }

    public UserDreamProfileDTO calculateUserProfile(Long userId) {
        List<Dream> dreams = dreamRepo.findAllByUserIdOrderByDreamDateDesc(userId);

        int   totalTags = 0;
        double eSum = 0, rcSum = 0, soSum = 0, alSum = 0, clSum = 0;

        for (Dream d : dreams) {
            Set<Tag> tags = d.getTags();

            boolean hasNoTags = tags.stream().anyMatch(t -> "no_tags".equals(t.getName()));
            if (hasNoTags) {
                continue;
            }

            for (Tag tag : tags) {
                eSum   += tag.getEmotionalTone();
                rcSum  += tag.getRationalityCreativity();
                soSum  += tag.getSocialOrientation();
                alSum  += tag.getActivityLevel();
                clSum  += tag.getControlLevel();
                totalTags++;
            }
        }

        UserDreamProfileDTO profile = new UserDreamProfileDTO();
        if (totalTags > 0) {
            profile.setEmotionalTone(eSum / totalTags);
            profile.setRationalityCreativity(rcSum / totalTags);
            profile.setSocialOrientation(soSum / totalTags);
            profile.setActivityLevel(alSum / totalTags);
            profile.setControlLevel(clSum / totalTags);
        }
        return profile;
    }

    public List<ProfileMatchDTO> matchUserToArchetypes(Long userId) {
        UserDreamProfileDTO u = calculateUserProfile(userId);

        return profileRepo.findAll().stream()
            .map(p -> {
                double sim = similarityScore(u, p);
                return new ProfileMatchDTO(p.getName(), sim);
            })
            .sorted(Comparator.comparingDouble(ProfileMatchDTO::getSimilarity).reversed())
            .collect(Collectors.toList());
    }

    private double similarityScore(UserDreamProfileDTO u, Profile p) {

        /* ---------- cosine part ---------- */
        double dot =
            u.getEmotionalTone()          * p.getEmotionalTone()
            + u.getRationalityCreativity() * p.getRationalityCreativity()
            + u.getSocialOrientation()     * p.getSocialOrientation()
            + u.getActivityLevel()         * p.getActivityLevel()
            + u.getControlLevel()          * p.getControlLevel();

        double uNorm = computeNorm(u);
        double pNorm = Math.sqrt(
            1.0 * p.getEmotionalTone()          * p.getEmotionalTone()
            +      p.getRationalityCreativity() * p.getRationalityCreativity()
            +      p.getSocialOrientation()     * p.getSocialOrientation()
            +      p.getActivityLevel()         * p.getActivityLevel()
            +      p.getControlLevel()          * p.getControlLevel()
        );

        double cosine = (uNorm == 0 || pNorm == 0) ? 0.0 : dot / (uNorm * pNorm);

        /* ---------- distance penalty ---------- */
        double euclid = Math.sqrt(
            Math.pow(u.getEmotionalTone()          - p.getEmotionalTone(),          2)
            + Math.pow(u.getRationalityCreativity() - p.getRationalityCreativity(), 2)
            + Math.pow(u.getSocialOrientation()     - p.getSocialOrientation(),     2)
            + Math.pow(u.getActivityLevel()         - p.getActivityLevel(),         2)
            + Math.pow(u.getControlLevel()          - p.getControlLevel(),          2)
        );

        // maximum possible distance in 5-D space when each axis ranges −5..+5 (difference = 10)
        double maxDist = Math.sqrt(5 * 100);   // √500 ≈ 22.36

        double distanceFactor = 1.0 - (euclid / maxDist);   // 1 → identical, 0 → completely opposite

        /* ---------- final combined score ---------- */
        return cosine * distanceFactor * 0.75;   // keeps direction similarity, penalises large gaps
    }

    private double computeNorm(UserDreamProfileDTO u) {
        return Math.sqrt(
              1.0 * u.getEmotionalTone()           * u.getEmotionalTone()
            +      u.getRationalityCreativity()  * u.getRationalityCreativity()
            +      u.getSocialOrientation()      * u.getSocialOrientation()
            +      u.getActivityLevel()          * u.getActivityLevel()
            +      u.getControlLevel()           * u.getControlLevel()
        );
    }
}

