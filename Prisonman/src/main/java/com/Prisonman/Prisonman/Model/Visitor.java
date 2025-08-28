package com.Prisonman.Prisonman.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "visitors")
public class Visitor {

    @Id
    private String _id;

    private String id;
    private String name;
    private String relationship;
    private String visitDate;
    private String visitTime;
    private String status;
    private String phone;
    private String idNumber;
    private String visitingInmate;

    public Visitor() {}

    public Visitor(String id, String name, String relationship, String visitDate, String visitTime,
                   String status, String phone, String idNumber, String visitingInmate) {
        this.id = id;
        this.name = name;
        this.relationship = relationship;
        this.visitDate = visitDate;
        this.visitTime = visitTime;
        this.status = status;
        this.phone = phone;
        this.idNumber = idNumber;
        this.visitingInmate = visitingInmate;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

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

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public String getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(String visitDate) {
        this.visitDate = visitDate;
    }

    public String getVisitTime() {
        return visitTime;
    }

    public void setVisitTime(String visitTime) {
        this.visitTime = visitTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public String getVisitingInmate() {
        return visitingInmate;
    }

    public void setVisitingInmate(String visitingInmate) {
        this.visitingInmate = visitingInmate;
    }
}
