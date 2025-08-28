package com.Prisonman.Prisonman.Controller;

import com.Prisonman.Prisonman.Model.Cell;
import com.Prisonman.Prisonman.Model.Inmate;
import com.Prisonman.Prisonman.Repository.CellRepository;
import com.Prisonman.Prisonman.Repository.InmateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inmates")
@CrossOrigin(origins = "http://localhost:5173")
public class InmateController {

    @Autowired
    private InmateRepository inmateRepository;

    @Autowired
    private CellRepository cellRepository;

    @GetMapping
    public List<Inmate> getAllInmates() {
        return inmateRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inmate> getInmateById(@PathVariable String id) {
        Optional<Inmate> inmate = inmateRepository.findById(id);
        return inmate.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addInmate(@RequestBody Inmate inmate) {
        Optional<Cell> availableCellOp = cellRepository.findAll().stream()
                .filter(cell -> cell.getCurrentOccupancy() < cell.getCapacity())
                .findFirst();

        if (availableCellOp.isEmpty()) {
            return ResponseEntity.status(409).body("No available cells to assign inmate");
        }

        Cell cell = availableCellOp.get();

        inmate.setCellNumber(cell.getCellNumber());
        inmate.setBlock(cell.getBlock());

        Inmate savedInmate = inmateRepository.save(inmate);

        List<String> inmatesList = cell.getInmates();
        inmatesList.add(savedInmate.getInmateId());

        cell.setInmates(inmatesList);
        cell.setCurrentOccupancy(cell.getCurrentOccupancy() + 1);

        if (cell.getCurrentOccupancy() >= cell.getCapacity()) {
            cell.setStatus("Occupied");
        } else {
            cell.setStatus("Available");
        }

        cellRepository.save(cell);

        return ResponseEntity.ok(savedInmate);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inmate> updateInmate(@PathVariable String id, @RequestBody Inmate updatedInmate) {
        return inmateRepository.findById(id).map(inmate -> {
            inmate.setName(updatedInmate.getName());
            inmate.setInmateId(updatedInmate.getInmateId());
            inmate.setAge(updatedInmate.getAge());
            inmate.setAdmissionDate(updatedInmate.getAdmissionDate());
            inmate.setStatus(updatedInmate.getStatus());
            inmate.setCharges(updatedInmate.getCharges());
            inmate.setBlock(updatedInmate.getBlock());
            Inmate saved = inmateRepository.save(inmate);
            return ResponseEntity.ok(saved);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE inmate by ID with cell update
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInmate(@PathVariable String id) {
        Optional<Inmate> inmateOpt = inmateRepository.findById(id);
        if (inmateOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Inmate inmate = inmateOpt.get();

        Optional<Cell> cellOpt = cellRepository.findAll().stream()
                .filter(cell -> cell.getCellNumber().equals(inmate.getCellNumber()) &&
                        cell.getBlock().equals(inmate.getBlock()))
                .findFirst();

        if (cellOpt.isPresent()) {
            Cell cell = getCell(cellOpt, inmate);

            cellRepository.save(cell);
        }

        inmateRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private static Cell getCell(Optional<Cell> cellOpt, Inmate inmate) {
        Cell cell = cellOpt.get();

        List<String> inmatesList = cell.getInmates();
        inmatesList.remove(inmate.getInmateId());
        cell.setInmates(inmatesList);

        cell.setCurrentOccupancy(cell.getCurrentOccupancy() - 1);

        if (cell.getCurrentOccupancy() < cell.getCapacity()) {
            cell.setStatus("Available");
        }
        return cell;
    }
}
