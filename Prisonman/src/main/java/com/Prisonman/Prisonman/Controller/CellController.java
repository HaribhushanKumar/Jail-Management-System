package com.Prisonman.Prisonman.Controller;

import com.Prisonman.Prisonman.Model.Cell;
import com.Prisonman.Prisonman.Repository.CellRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cells")
@CrossOrigin(origins = "http://localhost:5173")
public class CellController {

    @Autowired
    private CellRepository cellRepository;

    @GetMapping
    public List<Cell> getAllCells() {
        return cellRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cell> getCellById(@PathVariable String id) {
        Optional<Cell> cell = cellRepository.findById(id);
        return cell.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cell> createCell(@RequestBody Cell cell) {
        Cell saved = cellRepository.save(cell);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cell> updateCell(@PathVariable String id, @RequestBody Cell updatedCell) {
        return cellRepository.findById(id)
                .map(cell -> {
                    cell.setId(updatedCell.getId());
                    cell.setCellNumber(updatedCell.getCellNumber());
                    cell.setBlock(updatedCell.getBlock());
                    cell.setCapacity(updatedCell.getCapacity());
                    cell.setCurrentOccupancy(updatedCell.getCurrentOccupancy());
                    cell.setStatus(updatedCell.getStatus());
                    cell.setInmates(updatedCell.getInmates());

                    Cell saved = cellRepository.save(cell);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
