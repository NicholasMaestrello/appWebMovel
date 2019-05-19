import {Component, ViewChild} from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Nav, Platform} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {TabsPage} from '../tabs/tabs';
import {ResidenciaUsuarioListPage} from '../residencia-usuario-list/residencia-usuario-list';
import {AboutPage} from '../about/about';
import {CadastroUsuarioPage} from "../cadastro-usuario/cadastro-usuario";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen) {
    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Procurar Imovel', component: TabsPage},
      {title: 'Meus Imoveis', component: ResidenciaUsuarioListPage},
      {title: 'Minha Conta', component: CadastroUsuarioPage},
      {title: 'Sobre', component: AboutPage}
    ];
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.nav.setRoot(LoginPage);
  }
}
