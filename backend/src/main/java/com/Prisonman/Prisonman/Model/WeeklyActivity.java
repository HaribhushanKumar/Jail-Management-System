package com.Prisonman.Prisonman.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "weekly_activity")
public class WeeklyActivity {

    @Id
    private String id;

    private String day;
    private int admissions;
    private int releases;
    private int visitors;
    private int incidents;

    // Constructors
    public WeeklyActivity() {}

    public WeeklyActivity(String day, int admissions, int releases, int visitors, int incidents) {
        this.day = day;
        this.admissions = admissions;
        this.releases = releases;
        this.visitors = visitors;
        this.incidents = incidents;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public int getAdmissions() {
        return admissions;
    }

    public void setAdmissions(int admissions) {
        this.admissions = admissions;
    }

    public int getReleases() {
        return releases;
    }

    public void setReleases(int releases) {
        this.releases = releases;
    }

    public int getVisitors() {
        return visitors;
    }

    public void setVisitors(int visitors) {
        this.visitors = visitors;
    }

    public int getIncidents() {
        return incidents;
    }

    public void setIncidents(int incidents) {
        this.incidents = incidents;
    }
}
