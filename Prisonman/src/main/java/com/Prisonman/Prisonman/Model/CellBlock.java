package com.Prisonman.Prisonman.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cell_blocks")
public class CellBlock {

    @Id
    private String id;

    private String name;
    private int capacity;
    private int current;
    private int utilization;

    // Constructors
    public CellBlock() {}

    public CellBlock(String id, String name, int capacity, int current, int utilization) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.current = current;
        this.utilization = utilization;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getCapacity() {
        return capacity;
    }
    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }
    public int getCurrent() {
        return current;
    }
    public void setCurrent(int current) {
        this.current = current;
    }
    public int getUtilization() {
        return utilization;
    }
    public void setUtilization(int utilization) {
        this.utilization = utilization;
    }
}
