package com.Prisonman.Prisonman.Controller;

import com.Prisonman.Prisonman.Model.DashboardSummary;
import com.Prisonman.Prisonman.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard-summary")
@CrossOrigin(origins = "*")
public class DashboardSummaryController {

    @Autowired
    private InmateRepository inmateRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private VisitorRepository visitorRepository;

    @Autowired
    private CellRepository cellRepository;

    @Autowired
    private CellBlockRepository cellBlockRepository;

    @Autowired
    private StaffStatusRepository staffStatusRepository;

    @Autowired
    private WeeklyActivityRepository weeklyActivityRepository;

    @GetMapping
    public DashboardSummary getSummary() {
        long inmateCount = inmateRepository.count();
        int totalInmates = inmateCount > 0 ? (int) inmateCount : 
            cellBlockRepository.findAll().stream().mapToInt(b -> b.getCurrent()).sum();

        long activeStaffCount = staffRepository.findAll().stream()
            .filter(s -> "Active".equalsIgnoreCase(s.getStatus()))
            .count();
        int activeStaff = activeStaffCount > 0 ? (int) activeStaffCount : 
            staffStatusRepository.findAll().stream().mapToInt(s -> s.getValue()).sum();

        long visitorCount = visitorRepository.count();
        int dailyVisitors = visitorCount > 0 ? (int) visitorCount : 
            weeklyActivityRepository.findAll().stream().mapToInt(w -> w.getVisitors()).sum();

        long availableCellCount = cellRepository.findAll().stream()
            .filter(c -> "Available".equalsIgnoreCase(c.getStatus()) || (c.getCapacity() - c.getCurrentOccupancy() > 0))
            .count();
        int availableCells = availableCellCount > 0 ? (int) availableCellCount : 
            cellBlockRepository.findAll().stream().mapToInt(b -> b.getCapacity() - b.getCurrent()).sum();

        return new DashboardSummary(totalInmates, activeStaff, dailyVisitors, availableCells);
    }
}
