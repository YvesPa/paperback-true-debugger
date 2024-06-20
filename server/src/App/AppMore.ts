import { Cookie } from "@paperback/types";
import { AppRequestManager } from "./AppRequestManager";

declare global {
  namespace App {
      function setAllCookies(cookies: Cookie[]): void;
      function getAllCookies(): Cookie[];
      function setAllStates(states: Record<string, any>): void;
      function getAllStates(): Record<string, any>;
      function setDefaultUserAgent(userAgent: string): void;
      function getHostName(): string|undefined;
      function setHostName(hostName: string): void;
      function getRequestManager(): AppRequestManager|undefined;
  }
}