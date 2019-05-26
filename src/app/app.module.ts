// angular
import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
// ionic
import {IonicStorageModule} from '@ionic/storage';
// ionic-anguar
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
// ionic-native
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Geolocation} from '@ionic-native/geolocation';
import {NativeGeocoder} from "@ionic-native/native-geocoder";
// Pages
import {MapaPage} from '../pages/mapa/mapa';
import {CadastroUsuarioPage} from '../pages/cadastro-usuario/cadastro-usuario';
import {LoginPage} from '../pages/login/login';
import {TabsPage} from '../pages/tabs/tabs';
import {ResidenciaListPage} from '../pages/residencia-list/residencia-list';
import {HomePage} from '../pages/home/home';
import {ResidenciaDetalhePage} from '../pages/residencia-detalhe/residencia-detalhe';
import {ResidenciaUsuarioListPage} from '../pages/residencia-usuario-list/residencia-usuario-list';
import {ResidenciaUsuarioFormPage} from '../pages/residencia-usuario-form/residencia-usuario-form';
import {AboutPage} from '../pages/about/about';
import {ErrorPage} from '../pages/error/error';
import {FilterPage} from "../pages/filter/filter";
// Providers
import {HttpClientProvider} from '../providers/http-client/http-client';
// components
import {MyApp} from './app.component';
import {AgmCoreModule} from "@agm/core";
import {LoadingProvider} from '../providers/loading/loading';
// enviroment
import {mapsConfig} from "../environments/environment";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapaPage,
    CadastroUsuarioPage,
    LoginPage,
    TabsPage,
    ResidenciaListPage,
    ResidenciaDetalhePage,
    ResidenciaUsuarioListPage,
    ResidenciaUsuarioFormPage,
    AboutPage,
    ErrorPage,
    FilterPage
  ],
  imports: [
    AgmCoreModule.forRoot(mapsConfig),
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot({
      name: '__appdb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapaPage,
    CadastroUsuarioPage,
    LoginPage,
    TabsPage,
    ResidenciaListPage,
    ResidenciaDetalhePage,
    ResidenciaUsuarioListPage,
    ResidenciaUsuarioFormPage,
    AboutPage,
    ErrorPage,
    FilterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    NativeGeocoder,
    HttpClientProvider,
    LoadingProvider
  ]
})
export class AppModule {
}
