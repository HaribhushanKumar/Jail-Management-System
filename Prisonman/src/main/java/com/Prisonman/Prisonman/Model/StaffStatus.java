package com.Prisonman.Prisonman.Model;

import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "staff_status")
public class StaffStatus {
    @Id
    private String id;
    @Setter
    private String name;
    @Setter
    private int value;

    public StaffStatus() {}  // Empty constructor needed by Spring Data

    public StaffStatus(String name, int value) {
        this.name = name;
        this.value = value;
    }

    // Getters and setters
    public String getId() { return id; }
    public String getName() { return name; }

    public int getValue() { return value; }
}
