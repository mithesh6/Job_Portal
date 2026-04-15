package com.jobportal.controller;

import com.jobportal.entity.Job;
import com.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    JobRepository jobRepository;

    @Autowired
    com.jobportal.repository.UserRepository userRepository;

    @GetMapping
    public List<Job> getAllJobs(@RequestParam(required = false) String location, @RequestParam(required = false) String search) {
        if (location != null && !location.isEmpty()) {
            return jobRepository.findByLocationContainingIgnoreCase(location);
        }
        if (search != null && !search.isEmpty()) {
            return jobRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrSkillsContainingIgnoreCase(search, search, search);
        }
        return jobRepository.findAll();
    }

    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('USER')")
    public List<Job> getRecommendations(java.security.Principal principal) {
        String username = principal.getName();
        return userRepository.findByUsername(username).map(user -> {
            String userSkills = user.getSkills();
            if (userSkills == null || userSkills.isEmpty()) return jobRepository.findAll();
            
            String[] skillsArray = userSkills.split(",");
            return jobRepository.findAll().stream()
                .filter(job -> {
                    if (job.getSkills() == null) return false;
                    for (String skill : skillsArray) {
                        if (job.getSkills().toLowerCase().contains(skill.trim().toLowerCase())) return true;
                    }
                    return false;
                }).toList();
        }).orElse(List.of());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Job createJob(@RequestBody Job job) {
        job.setDatePosted(new Date());
        return jobRepository.save(job);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job jobDetails) {
        return jobRepository.findById(id).map(job -> {
            job.setTitle(jobDetails.getTitle());
            job.setDescription(jobDetails.getDescription());
            job.setCompany(jobDetails.getCompany());
            job.setLocation(jobDetails.getLocation());
            job.setSkills(jobDetails.getSkills());
            return ResponseEntity.ok(jobRepository.save(job));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        return jobRepository.findById(id).map(job -> {
            jobRepository.delete(job);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
