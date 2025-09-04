package com.springboot.be.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PlaceInfo {
    private String formattedAddress;
    private double latitude;
    private double longitude;
}
