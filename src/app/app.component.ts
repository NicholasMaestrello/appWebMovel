import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';

/**
 * Componiente root da aplicação, que redireciona a aplicação para a pagina de login
 */
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  /**
   * Construtor com injeção de dependencias
   * @param platform
   * @param statusBar
   * @param splashScreen
   */
  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
