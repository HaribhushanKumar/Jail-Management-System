package com.Prisonman.Prisonman.Controller;

import com.Prisonman.Prisonman.Model.WeeklyActivity;
import com.Prisonman.Prisonman.Repository.WeeklyActivityRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weekly-activity")
@CrossOrigin(origins = "http://localhost:5173")
public class WeeklyActivityController {

    @Autowired
    private WeeklyActivityRepository weeklyActivityRepository;

    // Get all activity records
    @GetMapping
    public List<WeeklyActivity> getAllWeeklyActivities() {
        return weeklyActivityRepository.findAll();
    }

    // Get by ID
    @GetMapping("/{id}")
    public WeeklyActivity getById(@PathVariable String id) {
        return weeklyActivityRepository.findById(id).orElse(null);
    }

    // Create new
    @PostMapping
    public WeeklyActivity create(@RequestBody WeeklyActivity activity) {
        return weeklyActivityRepository.save(activity);
    }

    // Update
    @PutMapping("/{id}")
    public WeeklyActivity update(@PathVariable String id, @RequestBody WeeklyActivity newActivity) {
        return weeklyActivityRepository.findById(id).map(existing -> {
            existing.setDay(newActivity.getDay());
            existing.setAdmissions(newActivity.getAdmissions());
            existing.setReleases(newActivity.getReleases());
            existing.setVisitors(newActivity.getVisitors());
            existing.setIncidents(newActivity.getIncidents());
            return weeklyActivityRepository.save(existing);
        }).orElse(null);
    }

    // Delete
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        weeklyActivityRepository.deleteById(id);
    }
}
