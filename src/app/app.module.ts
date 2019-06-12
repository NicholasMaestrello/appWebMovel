// angular
import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import localePtBr from '@angular/common/locales/pt';
import {registerLocaleData} from "@angular/common";
// ionic
import {IonicStorageModule} from '@ionic/storage';
// ionic-anguar
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
// ionic-native
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Geolocation} from '@ionic-native/geolocation';
import {NativeGeocoder} from "@ionic-native/native-geocoder";
import {Network} from "@ionic-native/network";
import {ImagePicker} from "@ionic-native/image-picker";
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
import {ResidenciaUsuarioPhotoPage} from "../pages/residencia-usuario-photo/residencia-usuario-photo";
// Providers
import {HttpClientProvider} from '../providers/http-client/http-client';
// components
import {MyApp} from './app.component';
import {AgmCoreModule} from "@agm/core";
import {LoadingProvider} from '../providers/loading/loading';
// enviroment
import {mapsConfig} from "../environments/environment";

// terceiros
import {NgxMaskModule} from "ngx-mask";
import {BrMaskerModule} from "brmasker-ionic-3";

registerLocaleData(localePtBr, 'pt');

/**
 * Modulo principal do sistema, aonde ocorrem todos os importes e declaração de componentes
 */
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
    FilterPage,
    ResidenciaUsuarioPhotoPage
  ],
  imports: [
    AgmCoreModule.forRoot(mapsConfig),
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    ReactiveFormsModule,
    BrMaskerModule,
    NgxMaskModule.forRoot(),
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
    FilterPage,
    ResidenciaUsuarioPhotoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    Geolocation,
    NativeGeocoder,
    HttpClientProvider,
    LoadingProvider,
    Network,
    ImagePicker
  ]
})
export class AppModule {
}
