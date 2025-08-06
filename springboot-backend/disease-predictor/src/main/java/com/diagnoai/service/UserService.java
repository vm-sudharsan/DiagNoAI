package com.diagnoai.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.diagnoai.entity.User;
import com.diagnoai.entity.UserRole;
import com.diagnoai.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return UserPrincipal.create(user);
    }

    public User createUser(String username, String fullName, String email, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = new User(username, fullName, email, passwordEncoder.encode(password));
        user.setRole(UserRole.USER);

        return userRepository.save(user);
    }

    @Transactional
    public User createRelativeUser(String username, String fullName, String email, String password, User mainUser) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already in use!");
        }

        User relative = new User(username, fullName, email, passwordEncoder.encode(password));
        relative.setRole(UserRole.RELATIVE);

        User savedRelative = userRepository.save(relative);

        // Add the relationship using direct database operations to avoid loading complex object graphs
        // Insert the relationship directly into the join table
        userRepository.addRelativeRelationship(mainUser.getId(), savedRelative.getId());

        return savedRelative;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void addRelative(Long userId, Long relativeId) {
        User user = userRepository.findByIdWithRelatives(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User relative = userRepository.findById(relativeId)
                .orElseThrow(() -> new RuntimeException("Relative not found"));

        user.addRelative(relative);
        userRepository.save(user);
    }

    public void removeRelative(Long userId, Long relativeId) {
        User user = userRepository.findByIdWithRelatives(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User relative = userRepository.findById(relativeId)
                .orElseThrow(() -> new RuntimeException("Relative not found"));

        user.removeRelative(relative);
        userRepository.save(user);
    }

    public List<User> getRelatives(Long userId) {
        return userRepository.findRelativesByUserId(userId);
    }

    public List<User> searchUsersByName(String name) {
        return userRepository.findByFullNameContainingAndIsActiveTrue(name);
    }

    public boolean hasAccessToUser(Long requesterId, Long targetUserId) {
        if (requesterId.equals(targetUserId)) {
            return true;
        }

        // Check if requester has target as a relative
        List<User> requesterRelatives = userRepository.findRelativesByUserId(requesterId);
        boolean hasAsRelative = requesterRelatives.stream()
                .anyMatch(relative -> relative.getId().equals(targetUserId));

        if (hasAsRelative) {
            return true;
        }

        // Check if target has requester as a relative
        List<User> targetRelatives = userRepository.findRelativesByUserId(targetUserId);
        return targetRelatives.stream()
                .anyMatch(relative -> relative.getId().equals(requesterId));
    }

    /**
     * Check if a relative user has access to any main user's data
     *
     * @param relativeId The ID of the relative user
     * @return true if the relative has access to at least one main user's data
     */
    public boolean hasRelativeAccess(Long relativeId) {
        // Find all users who have this relative in their relatives list
        List<User> mainUsers = userRepository.findUsersWhoHaveAsRelative(relativeId);
        return !mainUsers.isEmpty();
    }
}
