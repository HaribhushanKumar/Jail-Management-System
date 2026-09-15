package com.Prisonman.Prisonman.Controller;

import com.Prisonman.Prisonman.Model.Staff;
import com.Prisonman.Prisonman.Repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
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

    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable String id, @RequestBody Staff updatedStaff) {
        return staffRepository.findById(id).map(staff -> {
            staff.setName(updatedStaff.getName());
            staff.setEmployeeId(updatedStaff.getEmployeeId());
            staff.setPosition(updatedStaff.getPosition());
            staff.setDepartment(updatedStaff.getDepartment());
            staff.setShift(updatedStaff.getShift());
            staff.setStatus(updatedStaff.getStatus());
            staff.setHireDate(updatedStaff.getHireDate());
            staff.setPhone(updatedStaff.getPhone());
            Staff saved = staffRepository.save(staff);
            return ResponseEntity.ok(saved);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteStaff(@PathVariable String id) {
        staffRepository.deleteById(id);
    }
}
