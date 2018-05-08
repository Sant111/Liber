import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';


@IonicPage()
@Component({
  selector: 'page-authorize',
  templateUrl: 'authorize.html',
})
export class AuthorizePage {


  public user={
    username: "",
    password:""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private af: AngularFirestore) {
  }

  loginUser(){
    this.af.app.auth()
      .signInWithEmailAndPassword(this.user.username, this.user.password)
      .then(response =>{
        console.log(response);
      })
      .catch(error =>{
        console.log(error);
      })
  }
  
  registerUser(){
    this.af.app.auth()
    .createUserWithEmailAndPassword(this.user.username, this.user.password)
    .then(response =>{
      console.log(response);
    })
    .catch(error =>{
      console.log(error);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthorizePage');
  }
}
