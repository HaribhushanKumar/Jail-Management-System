package com.Prisonman.Prisonman.Repository;

import com.Prisonman.Prisonman.Model.WeeklyActivity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeeklyActivityRepository extends MongoRepository<WeeklyActivity, String> {
}
