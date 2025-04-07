package com.ITristii.backend.service;

import com.ITristii.backend.dto.AuthResponse;
import com.ITristii.backend.dto.RegisterRequest;
import com.ITristii.backend.model.User;
import com.ITristii.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);


        String token = jwtService.generateToken(user.getUsername());
        return new AuthResponse(token);
    }
}
