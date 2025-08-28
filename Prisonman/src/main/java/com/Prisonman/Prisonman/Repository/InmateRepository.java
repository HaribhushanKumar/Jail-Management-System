package com.Prisonman.Prisonman.Repository;

import com.Prisonman.Prisonman.Model.Inmate;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface InmateRepository extends MongoRepository<Inmate, String> {
    Optional<Inmate> findByInmateId(String inmateId);
}
