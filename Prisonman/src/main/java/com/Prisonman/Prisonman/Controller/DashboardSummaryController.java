package com.Prisonman.Prisonman.Controller;

import com.Prisonman.Prisonman.Model.CellBlock;
import com.Prisonman.Prisonman.Model.DashboardSummary;
import com.Prisonman.Prisonman.Model.StaffStatus;
import com.Prisonman.Prisonman.Model.WeeklyActivity;
import com.Prisonman.Prisonman.Repository.CellBlockRepository;
import com.Prisonman.Prisonman.Repository.StaffStatusRepository;
import com.Prisonman.Prisonman.Repository.WeeklyActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard-summary")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardSummaryController {

    @Autowired
    private CellBlockRepository cellBlockRepo;

    @Autowired
    private StaffStatusRepository staffRepo;

    @Autowired
    private WeeklyActivityRepository weeklyRepo;

    @GetMapping
    public DashboardSummary getSummary() {
        List<CellBlock> blocks = cellBlockRepo.findAll();
        int totalInmates = blocks.stream().mapToInt(CellBlock::getCurrent).sum();
        int availableCells = blocks.stream().mapToInt(block -> block.getCapacity() - block.getCurrent()).sum();

        int activeStaff = staffRepo.findAll().stream().mapToInt(StaffStatus::getValue).sum();
        int dailyVisitors = weeklyRepo.findAll().stream().mapToInt(WeeklyActivity::getVisitors).sum();

        return new DashboardSummary(totalInmates, activeStaff, dailyVisitors, availableCells);
    }
}
