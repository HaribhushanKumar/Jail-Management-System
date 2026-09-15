package com.Prisonman.Prisonman.Controller;

import com.Prisonman.Prisonman.Model.CellBlock;
import com.Prisonman.Prisonman.Repository.CellBlockRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cell-block")
@CrossOrigin(origins = "http://localhost:5173")
public class CellBlockController {

    @Autowired
    private CellBlockRepository cellBlockRepository;

    // Get all cell blocks
    @GetMapping
    public List<CellBlock> getAllCellBlocks() {
        return cellBlockRepository.findAll();
    }

    // Get a single cell block by id (optional)
    @GetMapping("/{id}")
    public CellBlock getCellBlockById(@PathVariable String id) {
        return cellBlockRepository.findById(id).orElse(null);
    }

    // Create a new cell block
    @PostMapping
    public CellBlock createCellBlock(@RequestBody CellBlock cellBlock) {
        return cellBlockRepository.save(cellBlock);
    }

    // Update existing cell block
    @PutMapping("/{id}")
    public CellBlock updateCellBlock(@PathVariable String id, @RequestBody CellBlock updatedCellBlock) {
        return cellBlockRepository.findById(id)
                .map(cellBlock -> {
                    cellBlock.setName(updatedCellBlock.getName());
                    cellBlock.setCapacity(updatedCellBlock.getCapacity());
                    cellBlock.setCurrent(updatedCellBlock.getCurrent());
                    cellBlock.setUtilization(updatedCellBlock.getUtilization());
                    return cellBlockRepository.save(cellBlock);
                })
                .orElse(null);
    }

    // Delete a cell block
    @DeleteMapping("/{id}")
    public void deleteCellBlock(@PathVariable String id) {
        cellBlockRepository.deleteById(id);
    }
}
