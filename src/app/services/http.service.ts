import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  get(url: string, options?: any) {
    return this.httpClient
      .get(url, { ...options, withCredentials: true })
      .pipe(map(convertKeysToCamelCase));
  }

  post(url: string, body: any, options?: any) {
    return this.httpClient
      .post(url, body, { ...options, withCredentials: true })
      .pipe(map(convertKeysToCamelCase));
  }

  put(url: string, body: any, options?: any) {
    return this.httpClient
      .put(url, body, { ...options, withCredentials: true })
      .pipe(map(convertKeysToCamelCase));
  }

  delete(url: string, options?: any) {
    return this.httpClient
      .delete(url, { ...options, withCredentials: true })
      .pipe(map(convertKeysToCamelCase));
  }
}

function toCamelCase(str: string): string {
  return str.replace(/(_\w)/g, (match) => match[1].toUpperCase());
}

function convertKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[toCamelCase(key)] = convertKeysToCamelCase(obj[key]);
    }
    return newObj;
  }
  return obj;
}
