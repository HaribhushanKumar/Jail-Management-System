package com.Prisonman.Prisonman.Repository;

import com.Prisonman.Prisonman.Model.CellBlock;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CellBlockRepository extends MongoRepository<CellBlock, String> {
    // No extra methods needed now; basic CRUD provided by MongoRepository
}
