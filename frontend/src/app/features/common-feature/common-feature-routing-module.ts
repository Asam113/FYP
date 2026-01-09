import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Contact } from './contact/contact';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Chatbot } from '../../shared/widgets/chatbot/chatbot';
import { Error404 } from './error404/error404';

const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'contact', component: Contact },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'chatbot', component: Chatbot },
  { path: '**', component: Error404 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonFeatureRoutingModule { }
