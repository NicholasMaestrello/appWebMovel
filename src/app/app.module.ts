import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from "@ionic-native/native-geocoder";
import { MapaPage } from '../pages/mapa/mapa';

// Pages
import { CadastroUsuarioPage } from '../pages/cadastro-usuario/cadastro-usuario';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { ResidenciaListPage } from '../pages/residencia-list/residencia-list';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ResidenciaDetalhePage } from '../pages/residencia-detalhe/residencia-detalhe';
import { ResidenciaUsuarioListPage } from '../pages/residencia-usuario-list/residencia-usuario-list';
import { ResidenciaUsuarioFormPage } from '../pages/residencia-usuario-form/residencia-usuario-form';
import { AboutPage } from '../pages/about/about';
import { ContaPage } from '../pages/conta/conta';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MapaPage,
    CadastroUsuarioPage,
    LoginPage,
    TabsPage,
    ResidenciaListPage,
    ResidenciaDetalhePage,
    ResidenciaUsuarioListPage,
    ResidenciaUsuarioFormPage,
    AboutPage,
    ContaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    MapaPage,
    CadastroUsuarioPage,
    LoginPage,
    TabsPage,
    ResidenciaListPage,
    ResidenciaDetalhePage,
    ResidenciaUsuarioListPage,
    ResidenciaUsuarioFormPage,
    AboutPage,
    ContaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    NativeGeocoder
  ]
})
export class AppModule {}
