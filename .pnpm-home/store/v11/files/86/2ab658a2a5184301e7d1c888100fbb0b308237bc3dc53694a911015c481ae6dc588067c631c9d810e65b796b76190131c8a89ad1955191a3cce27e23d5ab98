import { httpMethods } from './http-methods.js';
/** Type guard which takes in a string and returns true if it is in fact an HTTPMethod */
export const isHttpMethod = (method) => method && typeof method === 'string' ? httpMethods.has(method.toLowerCase()) : false;
