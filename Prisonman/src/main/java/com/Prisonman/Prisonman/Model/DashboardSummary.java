package com.Prisonman.Prisonman.Model;

public class DashboardSummary {
    private int totalInmates;
    private int activeStaff;
    private int dailyVisitors;
    private int availableCells;

    public DashboardSummary() {}

    public DashboardSummary(int totalInmates, int activeStaff, int dailyVisitors, int availableCells) {
        this.totalInmates = totalInmates;
        this.activeStaff = activeStaff;
        this.dailyVisitors = dailyVisitors;
        this.availableCells = availableCells;
    }

    // Getters and setters (keep as is)
    public int getTotalInmates() { return totalInmates; }
    public void setTotalInmates(int totalInmates) { this.totalInmates = totalInmates; }

    public int getActiveStaff() { return activeStaff; }
    public void setActiveStaff(int activeStaff) { this.activeStaff = activeStaff; }

    public int getDailyVisitors() { return dailyVisitors; }
    public void setDailyVisitors(int dailyVisitors) { this.dailyVisitors = dailyVisitors; }

    public int getAvailableCells() { return availableCells; }
    public void setAvailableCells(int availableCells) { this.availableCells = availableCells; }
}
