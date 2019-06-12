import {Component, ViewChild} from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Nav, Platform} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {TabsPage} from '../tabs/tabs';
import {ResidenciaUsuarioListPage} from '../residencia-usuario-list/residencia-usuario-list';
import {AboutPage} from '../about/about';
import {CadastroUsuarioPage} from "../cadastro-usuario/cadastro-usuario";

/**
 * Componente home
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;

  pages: Array<{ title: string, component: any }>;

  /**
   * Construtor padrão com serviços injetados
   * @param platform
   * @param statusBar
   * @param splashScreen
   */
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

  /**
   * Metodo para atualizar root da aplicação
   * @param page
   */
  openPage(page) {
    this.nav.setRoot(page.component);
  }

  /**
   * Metodo para realizar logout
   */
  logout() {
    this.nav.setRoot(LoginPage);
  }
}
