import { IElbwalker, Utils, Walker } from '../types';

export const elb: IElbwalker.Elb = function () {
  (window.elbLayer = window.elbLayer || []).push(arguments);
};

export function assign<T>(target: T, source: Object = {}): T {
  // Check for array properties to merge them before overriding
  Object.entries(source).forEach(([key, sourceProp]) => {
    const targetProp = target[key as keyof typeof target];

    // Only merge arrays
    if (Array.isArray(targetProp) && Array.isArray(sourceProp)) {
      source[key as keyof typeof source] = sourceProp.reduce(
        (acc, item) => {
          // Remove duplicates
          return acc.includes(item) ? acc : [...acc, item];
        },
        [...targetProp],
      );
    }
  });

  return { ...target, ...source };
}

export function castValue(value: unknown): Walker.PropertyType {
  if (value === 'true') return true;
  if (value === 'false') return false;

  const number = Number(value); // Converts "" to 0
  if (value == number && value !== '') return number;

  return String(value);
}

export function debounce<P extends unknown[], R>(
  fn: (...args: P) => R,
  wait = 1000,
) {
  let timer: NodeJS.Timeout;

  return (...args: P): Promise<R> => {
    // abort previous invocation
    clearTimeout(timer);

    // Return value as promise
    return new Promise((resolve) => {
      // Schedule execution
      timer = setTimeout(() => {
        // Call the function
        resolve(fn(...args));
      }, wait);
    });
  };
}

export function getAttribute(element: Element, name: string): string {
  return element.getAttribute(name) || '';
}

export function getId(length = 6): string {
  for (var str = '', l = 36; str.length < length; )
    str += ((Math.random() * l) | 0).toString(l);
  return str;
}

export function getMarketingParameters(
  url: URL,
  custom: Utils.MarketingParameters = {},
): Walker.Properties {
  const data: Walker.Properties = {};
  const parameters = Object.assign(
    {
      utm_campaign: 'campaign',
      utm_content: 'content',
      dclid: 'clickId',
      fbclid: 'clickId',
      gclid: 'clickId',
      utm_medium: 'medium',
      msclkid: 'clickId',
      utm_source: 'source',
      utm_term: 'term',
    },
    custom,
  );

  Object.entries(parameters).forEach(([param, name]) => {
    const value = url.searchParams.get(param);
    if (value) data[name] = value;
  });

  return data;
}

export function getByStringDot(
  event: unknown,
  key: string,
  i: unknown = 0,
): unknown {
  // String dot notation for object ("data.id" -> { data: { id: 1 } })
  const value = key.split('.').reduce((obj, key) => {
    // Update the wildcard to the given index
    if (key == '*') key = String(i);

    if (obj instanceof Object) return obj[key as keyof typeof obj];

    return;
  }, event);

  return value;
}

export function isVisible(element: HTMLElement): boolean {
  // Check for hiding styles
  const style = getComputedStyle(element);
  if (style.display === 'none') return false;
  if (style.visibility !== 'visible') return false;
  if (style.opacity && Number(style.opacity) < 0.1) return false;

  // Window positions
  let pointContainer;
  const windowHeight = window.innerHeight; // Height of the viewport

  // Element positions
  const elemRectRel = element.getBoundingClientRect(); // Get the elements relative to the viewport
  const elementHeight = elemRectRel.height; // Height of the element
  const elementTopRel = elemRectRel.y; // Relative distance from window top to element top
  const elementBottomRel = elementTopRel + elementHeight; // Relative distance from window to to element bottom
  const elemCenterRel = {
    // Relative position on viewport of the elements center
    x: elemRectRel.x + element.offsetWidth / 2,
    y: elemRectRel.y + element.offsetHeight / 2,
  };

  // Differentiate between small and large elements
  if (elementHeight <= windowHeight) {
    // Smaller than the viewport

    // Must have a width and height
    if (
      element.offsetWidth + elemRectRel.width === 0 ||
      element.offsetHeight + elemRectRel.height === 0
    )
      return false;

    if (elemCenterRel.x < 0) return false;
    if (
      elemCenterRel.x >
      (document.documentElement.clientWidth || window.innerWidth)
    )
      return false;
    if (elemCenterRel.y < 0) return false;
    if (
      elemCenterRel.y >
      (document.documentElement.clientHeight || window.innerHeight)
    )
      return false;

    // Select the element that is at the center of the target
    pointContainer = document.elementFromPoint(
      elemCenterRel.x,
      elemCenterRel.y,
    );
  } else {
    // Bigger than the viewport

    // that are considered visible if they fill half of the screen
    const viewportCenter = windowHeight / 2;

    // Check if upper part is above the viewports center
    if (elementTopRel < 0 && elementBottomRel < viewportCenter) return false;

    // Check if lower part is below the viewports center
    if (elementBottomRel > windowHeight && elementTopRel > viewportCenter)
      return false;

    // Select the element that is in the middle of the screen
    pointContainer = document.elementFromPoint(
      elemCenterRel.x,
      windowHeight / 2,
    );
  }

  // Check for potential overlays
  if (pointContainer) {
    do {
      if (pointContainer === element) return true; // should be visible
    } while ((pointContainer = pointContainer.parentElement));
  }

  return false;
}

export function startSession(
  config: Utils.SessionStart = {},
): Walker.Properties | false {
  // Force a new session or start checking if it's a regular new one
  let isNew = config.isNew || false;

  // Entry type
  if (!isNew) {
    // Only focus on linked or direct navigation types
    // and ignore reloads and all others
    const [perf] = performance.getEntriesByType(
      'navigation',
    ) as PerformanceNavigationTiming[];
    if (perf.type !== 'navigate') return false;
  }

  const url = new URL(config.url || window.location.href);
  const ref = config.referrer || document.referrer;
  const referrer = ref && new URL(ref).hostname;
  const session: Walker.Properties = {};

  // Marketing
  const marketing = getMarketingParameters(url, config.parameters);
  if (Object.keys(marketing).length) {
    // Check for marketing parameters like UTM and add existing
    session.marketing = true; // Flag as a marketing session
    isNew = true;
  }

  // Referrer
  if (!isNew) {
    // Small chance of multiple unintendet events for same users
    // https://en.wikipedia.org/wiki/HTTP_referer#Referrer_hiding
    // Use domains: [''] to disable direct or hidden referrer

    const domains = config.domains || [];
    domains.push(url.hostname);
    isNew = !domains.includes(referrer);
  }

  // No new session
  if (!isNew) return false;

  if (referrer) session.referrer = referrer;
  Object.assign(
    session,
    {
      id: session.id || getId(12),
    },
    marketing,
    config.data,
  );

  // It's a new session, moin
  return session;
}

export function storageDelete(
  key: string,
  storage: Utils.Storage.Type = Utils.Storage.Type.Session,
) {
  switch (storage) {
    case Utils.Storage.Type.Cookie:
      storageWrite(key, '', 0, storage);
      break;
    case Utils.Storage.Type.Local:
      window.localStorage.removeItem(key);
      break;
    case Utils.Storage.Type.Session:
      window.sessionStorage.removeItem(key);
      break;
  }
}

export function storageRead(
  key: string,
  storage: Utils.Storage.Type = Utils.Storage.Type.Session,
): Walker.PropertyType {
  // Helper function for local and session storage to support expiration
  function parseItem(string: string | null): Utils.Storage.Value {
    try {
      return JSON.parse(string || '');
    } catch (err) {
      let e = 1,
        v = '';

      // Remove expiration date
      if (string) {
        e = 0;
        v = string;
      }

      return { e, v };
    }
  }
  let value, item;

  switch (storage) {
    case Utils.Storage.Type.Cookie:
      value = decodeURIComponent(
        document.cookie
          .split('; ')
          .find((row) => row.startsWith(key + '='))
          ?.split('=')[1] || '',
      );
      break;
    case Utils.Storage.Type.Local:
      item = parseItem(window.localStorage.getItem(key));
      break;
    case Utils.Storage.Type.Session:
      item = parseItem(window.sessionStorage.getItem(key));
      break;
  }

  // Check if item is expired
  if (item) {
    value = item.v;

    if (item.e != 0 && item.e < Date.now()) {
      storageDelete(key, storage); // Remove item
      value = ''; // Conceal the outdated value
    }
  }

  return castValue(value || '');
}

export function storageWrite(
  key: string,
  value: Walker.PropertyType,
  maxAgeInMinutes = 30,
  storage: Utils.Storage.Type = Utils.Storage.Type.Session,
  domain?: string,
): Walker.PropertyType {
  const e = Date.now() + 1000 * 60 * maxAgeInMinutes;
  const item: Utils.Storage.Value = { e, v: String(value) };
  const stringifiedItem = JSON.stringify(item);

  switch (storage) {
    case Utils.Storage.Type.Cookie:
      let cookie = `${key}=${encodeURIComponent(value)}; max-age=${
        maxAgeInMinutes * 60
      }; path=/; SameSite=Lax; secure`;

      if (domain) cookie += '; domain=' + domain;

      document.cookie = cookie;
      break;
    case Utils.Storage.Type.Local:
      window.localStorage.setItem(key, stringifiedItem);
      break;
    case Utils.Storage.Type.Session:
      window.sessionStorage.setItem(key, stringifiedItem);
      break;
  }

  return storageRead(key, storage);
}

export function throttle<P extends unknown[], R>(
  fn: (...args: P) => R | undefined,
  delay = 1000,
): (...args: P) => R | undefined {
  let isBlocked: NodeJS.Timeout | 0;

  return function (...args: P): R | undefined {
    // Skip since function is still blocked by previous call
    if (isBlocked) return;

    // Set a blocking timeout
    isBlocked = setTimeout(() => {
      // Unblock function
      isBlocked = 0;
    }, delay);

    // Call the function
    return fn(...args);
  };
}

export function trim(str: string): string {
  // Remove quotes and whitespaces
  return str ? str.trim().replace(/^'|'$/g, '').trim() : '';
}

export function trycatch<P extends unknown[], R>(
  fn: (...args: P) => R | undefined,
): (...args: P) => R | undefined {
  return function (...args: P): R | undefined {
    try {
      return fn(...args);
    } catch (err) {
      // @TODO custom fn
      console.error(IElbwalker.Commands.Walker, err);
      return;
    }
  };
}
