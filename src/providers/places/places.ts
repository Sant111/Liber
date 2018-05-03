import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class PlacesProvider {

  private GOOGLE_GEOCODE_API_KEY: string="AIzaSyBwNBQbFuAFlbjCJkIWbPwQ_TCh3t_lVh4";
  
  constructor(public http: HttpClient) {  }

  getAddressBasedOnLatLng(lat, lng){
    return new Promise((resolve, reject) => {
      this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=${this.GOOGLE_GEOCODE_API_KEY}`)
      .subscribe(
        (response) =>{
        resolve(response);
        }, (error)=>{
        reject(error);
        }           
      )
    });
  }
}
