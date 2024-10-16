import { UserRole } from "../utils/auth.roles";

export const defaultMenuType = 'menu-sub-hidden' // 'menu-default', 'menu-sub-hidden', 'menu-hidden';
export const adminRoot = '/app';
export const searchPath = `${adminRoot}/#`
export const buyUrl = 'https://1.envato.market/nEyZa'
// export const apiUrl = 'https://hireplus.piumenosystem.com/api';
// export const apiUrl = 'https://red-shark-302941.hostingersite.com/api';
export const apiUrl = 'https://phplaravel-1308414-4769563.cloudwaysapps.com/api';

export const subHiddenBreakpoint = 1440
export const menuHiddenBreakpoint = 768

export const defaultLocale = 'en'
export const defaultDirection = 'ltr'
export const localeOptions = [
  { id: 'en', name: 'English LTR', direction: 'ltr' },
  { id: 'es', name: 'Spanish LTR', direction: 'ltr' },
  { id: 'enrtl', name: 'English RTL', direction: 'rtl' }
]

export const firebaseConfig = {
  apiKey: "AIzaSyDe94G7L-3soXVSpVbsYlB5DfYH2L91aTU",
  authDomain: "piaf-vue-login.firebaseapp.com",
  databaseURL: "https://piaf-vue-login.firebaseio.com",
  projectId: "piaf-vue-login",
  storageBucket: "piaf-vue-login.appspot.com",
  messagingSenderId: "557576321564",
  appId: "1:557576321564:web:bc2ce73477aff5c2197dd9"
};

// export const currentUser = {
//   id: 1,
//   title: 'Courtney Love',
//   img: '/assets/img/profiles/l-1.jpg',
//   date: 'Last seen today 15:24',
//   role: UserRole.Admin
// }

export const currentUser = {
  // role: UserRole.Admin
}

export const isAuthGuardActive = true;
export const themeRadiusStorageKey = 'theme_radius'
export const themeSelectedColorStorageKey = 'theme_selected_color'
export const defaultColor = 'light.blueolympic'
export const colors = ['bluenavy', 'blueyale', 'blueolympic', 'greenmoss', 'greenlime', 'purplemonster', 'orangecarrot', 'redruby', 'yellowgranola', 'greysteel']
