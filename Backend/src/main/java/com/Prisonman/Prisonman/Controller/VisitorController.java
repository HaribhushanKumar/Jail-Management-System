package com.Prisonman.Prisonman.Controller;

import com.Prisonman.Prisonman.Model.Visitor;
import com.Prisonman.Prisonman.Repository.InmateRepository;
import com.Prisonman.Prisonman.Repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitors")
@CrossOrigin(origins = "http://localhost:5173")
public class VisitorController {

    @Autowired
    private InmateRepository inmateRepository;

    @Autowired
    private VisitorRepository visitorRepository;

    @GetMapping
    public List<Visitor> getAllVisitors() {
        return visitorRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createVisitor(@RequestBody Visitor visitor) {
        boolean inmateExists = inmateRepository.findByInmateId(visitor.getVisitingInmate()).isPresent();

        if (!inmateExists) {
            return ResponseEntity.status(400).body("The specified inmate does not exist.");
        }

        Visitor savedVisitor = visitorRepository.save(visitor);
        return ResponseEntity.ok(savedVisitor);
    }



    @DeleteMapping("/{id}")
    public void deleteVisitor(@PathVariable String id) {
        visitorRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Visitor updateVisitor(@PathVariable String id, @RequestBody Visitor updatedVisitor) {
        return visitorRepository.findById(id).map(visitor -> {
            visitor.setId(updatedVisitor.getId());
            visitor.setName(updatedVisitor.getName());
            visitor.setRelationship(updatedVisitor.getRelationship());
            visitor.setVisitDate(updatedVisitor.getVisitDate());
            visitor.setVisitTime(updatedVisitor.getVisitTime());
            visitor.setStatus(updatedVisitor.getStatus());
            visitor.setPhone(updatedVisitor.getPhone());
            visitor.setIdNumber(updatedVisitor.getIdNumber());
            visitor.setVisitingInmate(updatedVisitor.getVisitingInmate());
            return visitorRepository.save(visitor);
        }).orElseGet(() -> {
            updatedVisitor.set_id(id);
            return visitorRepository.save(updatedVisitor);
        });
    }
}
