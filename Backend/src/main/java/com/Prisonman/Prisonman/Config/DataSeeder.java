package com.Prisonman.Prisonman.Config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final MongoTemplate mongoTemplate;
    private final ObjectMapper objectMapper;

    public DataSeeder(MongoTemplate mongoTemplate, ObjectMapper objectMapper) {
        this.mongoTemplate = mongoTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) {
        seedCollection("cell_blocks", "database/prisonDB.cell_blocks.json");
        seedCollection("cells", "database/prisonDB.cells.json");
        seedCollection("inmates", "database/prisonDB.inmates.json");
        seedCollection("staff", "database/prisonDB.staff.json");
        seedCollection("staff_status", "database/prisonDB.staff_status.json");
        seedCollection("visitors", "database/prisonDB.visitors.json");
        seedCollection("weekly_activity", "database/prisonDB.weekly_activity.json");
    }

    private void seedCollection(String collectionName, String resourcePath) {
        try {
            if (mongoTemplate.collectionExists(collectionName) && mongoTemplate.getCollection(collectionName).countDocuments() > 0) {
                logger.info("Collection '{}' already contains data. Skipping seed.", collectionName);
                return;
            }

            Resource resource = new ClassPathResource(resourcePath);
            if (!resource.exists()) {
                logger.warn("Seed resource '{}' not found.", resourcePath);
                return;
            }

            try (InputStream inputStream = resource.getInputStream()) {
                String jsonContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                List<Map<String, Object>> items = objectMapper.readValue(jsonContent, new TypeReference<List<Map<String, Object>>>() {});
                
                List<Document> documents = new ArrayList<>();
                for (Map<String, Object> item : items) {
                    String itemJson = objectMapper.writeValueAsString(item);
                    documents.add(Document.parse(itemJson));
                }

                if (!documents.isEmpty()) {
                    mongoTemplate.insert(documents, collectionName);
                    logger.info("Successfully seeded {} documents into collection '{}'.", documents.size(), collectionName);
                }
            }
        } catch (Exception e) {
            logger.error("Error seeding collection '{}' from resource '{}': {}", collectionName, resourcePath, e.getMessage(), e);
        }
    }
}
