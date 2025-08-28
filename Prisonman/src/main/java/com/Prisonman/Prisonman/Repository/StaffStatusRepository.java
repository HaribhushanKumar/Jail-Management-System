package com.Prisonman.Prisonman.Repository;

import com.Prisonman.Prisonman.Model.StaffStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffStatusRepository extends MongoRepository<StaffStatus, String> {
    // You get basic CRUD methods out of the box
}
