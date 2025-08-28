package com.Prisonman.Prisonman.Controller;

import com.Prisonman.Prisonman.Model.Staff;
import com.Prisonman.Prisonman.Repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "http://localhost:5173")
public class StaffController {

    @Autowired
    private StaffRepository staffRepository;

    @GetMapping
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @PostMapping
    public Staff addStaff(@RequestBody Staff staff) {
        return staffRepository.save(staff);
    }

    @DeleteMapping("/{id}")
    public void deleteStaff(@PathVariable String id) {
        staffRepository.deleteById(id);
    }
}
