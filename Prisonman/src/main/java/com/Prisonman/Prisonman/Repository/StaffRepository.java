package com.Prisonman.Prisonman.Repository;

import com.Prisonman.Prisonman.Model.Staff;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StaffRepository extends MongoRepository<Staff, String> {
}
