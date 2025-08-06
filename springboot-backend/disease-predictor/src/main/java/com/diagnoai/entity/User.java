package com.diagnoai.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(unique = true)
    private String username;

    @NotBlank
    @Size(max = 100)
    private String fullName;

    @NotBlank
    @Size(max = 120)
    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    @Column(length = 15)
    private String phoneNumber;

    @Column(length = 10)
    private String gender;

    private Integer age;

    @Column(columnDefinition = "TEXT")
    private String medicalHistory;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private UserRole role = UserRole.USER;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Many-to-Many relationship for relatives
    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_relatives",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "relative_id")
    )
    private Set<User> relatives = new HashSet<>();

    // Inverse relationship - users who have this user as a relative
    @JsonIgnore
    @ManyToMany(mappedBy = "relatives", fetch = FetchType.LAZY)
    private Set<User> relativeOf = new HashSet<>();

    // One-to-Many relationship with test reports
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<TestReport> testReports = new HashSet<>();

    // Constructor for creating new user
    public User(String username, String fullName, String email, String password) {
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    // Helper methods for managing relatives
    public void addRelative(User relative) {
        this.relatives.add(relative);
        relative.getRelativeOf().add(this);
    }

    public void removeRelative(User relative) {
        this.relatives.remove(relative);
        relative.getRelativeOf().remove(this);
    }

    // Check if user has access to another user's data
    // Note: This method should only be used within an active Hibernate session
    // For safer access checking, use UserService.hasAccessToUser() instead
    public boolean hasAccessTo(User otherUser) {
        if (this.equals(otherUser)) {
            return true;
        }

        // Only check relatives if collections are initialized to avoid lazy loading issues
        try {
            return (this.relatives != null && this.relatives.contains(otherUser))
                    || (otherUser.relatives != null && otherUser.relatives.contains(this));
        } catch (Exception e) {
            // If lazy loading fails, return false and let the service layer handle it
            return false;
        }
    }

    // Custom equals and hashCode to avoid issues with lazy-loaded collections
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        User user = (User) o;
        return id != null && id.equals(user.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
