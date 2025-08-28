package com.Prisonman.Prisonman.Controller;

import com.Prisonman.Prisonman.Model.StaffStatus;
import com.Prisonman.Prisonman.Repository.StaffStatusRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff-status")
@CrossOrigin(origins = "http://localhost:5173")
public class StaffStatusController {

    private final StaffStatusRepository repository;

    public StaffStatusController(StaffStatusRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<StaffStatus> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public StaffStatus addStatus(@RequestBody StaffStatus status) {
        return repository.save(status);
    }
}
