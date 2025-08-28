package com.Prisonman.Prisonman.Repository;

import com.Prisonman.Prisonman.Model.Cell;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CellRepository extends MongoRepository<Cell, String> {
}
