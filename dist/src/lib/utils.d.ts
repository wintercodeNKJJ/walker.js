import { IElbwalker, Walker } from '../types';
export declare function trycatch<P extends unknown[], R>(fn: (...args: P) => R | undefined): (...args: P) => R | undefined;
export declare function randomString(): string;
export declare function getGlobalProperties(prefix: string): Walker.Properties;
export declare function splitAttribute(str: string, separator?: string): Walker.Attributes;
export declare function splitKeyVal(str: string): Walker.KeyVal;
export declare function parseAttribute(str: string): Walker.KeyVal;
export declare function getAttribute(element: Element, name: string): string;
export declare function assign(target: Walker.Properties, source?: Walker.Properties): Walker.Properties;
export declare function isArgument(event: unknown): boolean;
export declare const elb: IElbwalker.Elb;
export declare function castValue(value: unknown): Walker.Property;
