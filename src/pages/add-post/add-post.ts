import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Camera } from '@ionic-native/camera';
import { AngularFireStorage }  from 'angularfire2/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { PlacesProvider } from '../../providers/places/places';
import { Post } from '../../models/Post';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpClient } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {

public postCollection: AngularFirestoreCollection<Post>;
public postText: string ="";
private previewImage: string ="";
public location: {latitude: number, longitude: number} = {latitude: 0, longitude: 0};
private locationAddress: string ="";
private bokText: string="";
public apiUrl = "https://itunes.apple.com/lookup?isbn=";
public finalUrl: string;
public price: string;



constructor(
  public navCtrl: NavController,
  public http: HttpClient,
  public navParams: NavParams,
  private camera: Camera,
  public toastController: ToastController,
  private af: AngularFirestore,
  private afStorage: AngularFireStorage,
  private geolocation: Geolocation,
  private placesProvider: PlacesProvider,
  private barcodeScanner: BarcodeScanner){
    this.postCollection = navParams.get('postCollection');
  }


  addPost(){
    
    let imageFileName = `${this.af.app.auth().currentUser.email}_${new Date().getTime()}.png`;

    let task = this.afStorage
      .ref(imageFileName)
      .putString(this.previewImage, 'base64', { contentType: 'image/png'});

    let uploadEvent = task.downloadURL();
    
    uploadEvent.subscribe((uploadImageUrl) =>{ 
      this.postCollection.add({
        body: this.postText,
        locationAddress: this.locationAddress,
        author: this.af.app.auth().currentUser.email,
        imgUrl: uploadImageUrl
        
      }as Post).then(response => {
        console.log(response + " success. " + JSON.stringify(response));
        this.toasty();
      }).catch(error => {
        console.log("ERROR" + error + ", lesbar: " + JSON.stringify(error));
      });
    });
    this.navCtrl.pop();
  }

  findGeolocation(){
    this.geolocation.getCurrentPosition({enableHighAccuracy: true})
      .then(position =>{
        this.placesProvider.getAddressBasedOnLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then((place: any) =>{
          this.locationAddress = place.results[1].formatted_address;
        });
      }).catch(error =>{
        console.error(error);
      });
  }
  
  executeCamera(){
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      cameraDirection: this.camera.Direction.BACK,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    })
    .then(imgBase64 =>{
      this.previewImage = imgBase64;
    });
    console.log("Success");
  }

  scanTheBar(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.bokText=barcodeData.text;
      this.getInfoFromUrl();
     }).catch(err => {
         console.log('Error', err);
     });
  }

  getInfoFromUrl(){
    this.finalUrl = this.apiUrl + this.bokText;
    return new Promise((resolve, reject) => {
      this.http.get(this.finalUrl)
      .subscribe((info : any) => {
      console.log(this.finalUrl);
        this.price = info.result.formattedPrice;
        resolve(info);
      }, (err) => {
        reject(err);
      })
    })
  }

  toasty(){
    let toast = this.toastController.create({
      message: 'Boken er lagt til',
      duration: 2000
    });
    toast.present();
  }
}


