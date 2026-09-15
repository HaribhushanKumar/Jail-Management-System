package com.Prisonman.Prisonman.Repository;

import com.Prisonman.Prisonman.Model.Visitor;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VisitorRepository extends MongoRepository<Visitor, String> {
}
