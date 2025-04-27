// src/main/java/com/ITristii/backend/service/JwtService.java
package com.ITristii.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Service;
import java.util.Date;

// ← these three imports are new
import com.ITristii.backend.model.User;
import com.ITristii.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class JwtService {

    private final String secretKey = "secret123456789";
    private final long expirationTime = 86400000; // 1 day

    // ← inject the repo so we can look up the User by username
    private final UserRepository userRepository;

    // ← add this constructor
    public JwtService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String generateToken(String username) {
        // ← fetch the User entity so we can grab its ID
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // ← now embed userId as a claim
        return Jwts.builder()
                   .setSubject(username)
                   .claim("userId", user.getId())
                   .setIssuedAt(new Date())
                   .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                   .signWith(SignatureAlgorithm.HS512, secretKey)
                   .compact();
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                   .setSigningKey(secretKey)
                   .parseClaimsJws(token)
                   .getBody();
    }
}
