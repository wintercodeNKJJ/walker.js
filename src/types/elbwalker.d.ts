import { Walker, WebDestination } from '.';

export namespace IElbwalker {
  type AnyObject = Record<string, unknown>;

  export interface Function {
    push: Elb;
    config: Config;
  }

  interface Elb {
    (
      event: string,
      data?: PushData,
      trigger?: string,
      context?: Walker.Properties,
      nested?: Walker.Entities,
    ): void;
    (event: 'walker config', config: Partial<Config>): void;
    (event: 'walker consent', consent: Consent): void;
    (event: 'walker destination', destination: WebDestination.Function): void;
    (event: 'walker init', scope: Document | HTMLElement): void;
    (event: 'walker run'): void;
    (event: 'walker user', user: User): void;
  }

  type ElbLayer = [
    (IArguments | string)?,
    PushData?,
    string?,
    Walker.Properties?,
    Walker.Entities?,
  ];

  type PushData =
    | Partial<Config>
    | Consent
    | Scope
    | User
    | Walker.Properties
    | WebDestination.Function;

  type Scope = Document | HTMLElement;

  interface Config {
    consent: Consent;
    elbLayer: ElbLayer;
    globals: Walker.Properties;
    pageview: boolean;
    prefix: string;
    version: number;
    default?: boolean;
  }

  type Events = Event[];
  interface Event {
    event: string;
    data: Walker.Properties;
    context: Walker.Properties;
    globals: Walker.Properties;
    user: User;
    nested: Walker.Entities;
    id: string;
    trigger: string;
    entity: string;
    action: string;
    timestamp: number;
    timing: number;
    group: string;
    count: number;
    version: Version;
  }

  interface User {
    id?: string;
    device?: string;
    hash?: string;
  }

  const enum Commands {
    Action = 'action',
    Config = 'config',
    Consent = 'consent',
    Context = 'context',
    Destination = 'destination',
    Elb = 'elb',
    Globals = 'globals',
    Init = 'init',
    Prefix = 'data-elb',
    Run = 'run',
    User = 'user',
    Walker = 'walker',
  }

  interface Consent {
    [name: string]: boolean; // name of consent group or tool
  }

  interface Version {
    walker: number;
    config: number;
  }
}
