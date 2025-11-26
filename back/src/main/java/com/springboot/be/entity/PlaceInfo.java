package com.springboot.be.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PlaceInfo {
    private String formattedAddress;
    private double latitude;
    private double longitude;
}
