import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Post } from '../../models/Post';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public collection: AngularFirestoreCollection<Post>;
  public posts: Observable<Post[]>

  constructor(public navCtrl: NavController, private af: AngularFirestore) {
    this.collection = af.collection<Post>("posts");
    this.posts = this.collection.snapshotChanges().map(actions =>{
      return actions.map(action =>{
        let data = action.payload.doc.data() as Post;
        let id = action.payload.doc.id;

        return {
          id, 
          ...data
        };
      })
    });
}

goToDetailPage(post: Post){
  this.navCtrl.push('DetailPage',{
    post,
    postCollection: this.collection
  })
}

goToAddPostPage(){
  this.navCtrl.push('AddPostPage',{
    postCollection: this.collection
  })
} 

  logout(){
  this.af.app.auth().signOut();
  }
}
