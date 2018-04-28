import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthorizePage } from './authorize';

@NgModule({
  declarations: [
    AuthorizePage,
  ],
  imports: [
    IonicPageModule.forChild(AuthorizePage),
  ],
})
export class AuthorizePageModule {}
