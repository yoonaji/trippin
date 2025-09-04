package com.springboot.be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Marker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int photoCount = 0;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "global_place_id")
    private GlobalPlace globalPlace;

    @OneToMany(mappedBy = "marker")
    private List<Photo> photos = new ArrayList<>();

    public void increasePhotoCount() {
        this.photoCount++;
    }

    public void decreasePhotoCount() {
        if (this.photoCount > 0) this.photoCount--;
    }

    public void setGlobalPlace(GlobalPlace globalPlace) {
        this.globalPlace = globalPlace;
    }
}
