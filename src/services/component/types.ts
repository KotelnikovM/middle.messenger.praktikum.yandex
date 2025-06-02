import { Component } from './Component';

export type Tag = keyof HTMLElementTagNameMap;

export interface Children {
  [key: string]: Component;
}

export interface BlockProps {
  [key: string]: unknown;
  events?: EventMap;
}

interface EventMap {
  [key: string]: EventListenerOrEventListenerObject;
}
