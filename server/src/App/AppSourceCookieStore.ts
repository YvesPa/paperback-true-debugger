import { Cookie, SourceCookieStore } from "@paperback/types";

export class AppSourceCookieStore implements SourceCookieStore {
  private _cookies : Cookie[] = []

  getAllCookies(): Cookie[] {
    return this._cookies;
  }

  addCookie(cookies: Cookie): void {
    this._cookies.push(cookies);
  }
  removeCookie(cookie: Cookie): void {
    this._cookies = this._cookies.filter(c => c.name !== cookie.name);
  }

  setAllCookies(cookies: Cookie[]): void {
    this._cookies = cookies;
  }
}