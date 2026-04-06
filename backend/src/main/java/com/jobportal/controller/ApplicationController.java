package com.jobportal.controller;

import com.jobportal.entity.Application;
import com.jobportal.entity.ApplicationStatus;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.payload.MessageResponse;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    ApplicationRepository applicationRepository;

    @Autowired
    JobRepository jobRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/{jobId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> applyForJob(@PathVariable Long jobId, Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        Job job = jobRepository.findById(jobId).orElse(null);

        if (user == null || job == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("User or Job not found"));
        }

        if (applicationRepository.existsByUserAndJob(user, job)) {
            return ResponseEntity.badRequest().body(new MessageResponse("You have already applied for this job"));
        }

        Application application = new Application(user, job, ApplicationStatus.APPLIED, new Date());
        applicationRepository.save(application);

        return ResponseEntity.ok(new MessageResponse("Successfully applied for the job"));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Application>> getMyApplications(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(applicationRepository.findByUser(user));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getApplicationsForJob(@PathVariable Long jobId) {
        Job job = jobRepository.findById(jobId).orElse(null);
        if (job == null) return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(applicationRepository.findByJob(job));
    }

    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long applicationId, @RequestBody Map<String, String> statusUpdate) {
        return applicationRepository.findById(applicationId).map(application -> {
            try {
                ApplicationStatus status = ApplicationStatus.valueOf(statusUpdate.get("status").toUpperCase());
                application.setStatus(status);
                applicationRepository.save(application);
                return ResponseEntity.ok(new MessageResponse("Application status updated to " + status));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(new MessageResponse("Invalid status"));
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}
