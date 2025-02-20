import Elbwalker, { IElbwalker } from '@elbwalker/walker.js';
import { DestinationMetaPixel } from './types';

describe('Destination Meta Pixel', () => {
  const w = window;
  let elbwalker: IElbwalker.Function,
    destination: DestinationMetaPixel.Function,
    config: DestinationMetaPixel.Config;

  const mockFn = jest.fn(); //.mockImplementation(console.log);

  const event = 'entity action';
  const pixelId = '1234567890';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    config = {
      custom: { pixelId },
    };

    destination = require('.').default;
    destination.config = config;

    w.elbLayer = [];
    w.fbq = mockFn;

    elbwalker = Elbwalker({ pageview: false });
    elbwalker.push('walker run');
  });

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  test('init', () => {
    (w.fbq as any) = undefined;

    expect(w.fbq).not.toBeDefined();

    elbwalker.push('walker destination', destination);

    elbwalker.push(event);
    expect(w.fbq).toBeDefined();
  });

  test('Init calls', () => {
    elbwalker.push('walker destination', destination);

    elbwalker.push(event);

    expect(mockFn).toHaveBeenNthCalledWith(1, 'init', pixelId);
  });

  test('init with load script', () => {
    destination.config.loadScript = true;
    elbwalker.push('walker destination', destination);

    const scriptSelector = `script[src="https://connect.facebook.net/en_US/fbevents.js"]`;

    let elem = document.querySelector(scriptSelector);
    expect(elem).not.toBeTruthy();

    elbwalker.push(event);

    elem = document.querySelector(scriptSelector);
    expect(elem).toBeTruthy();
  });

  test('push', () => {
    elbwalker.push('walker destination', destination);
    elbwalker.push(event);
    expect(mockFn).toHaveBeenCalledWith('trackCustom', event);
  });

  test('pageview', () => {
    elbwalker.push('walker destination', destination);
    elbwalker.push(event);
    expect(mockFn).toHaveBeenCalledWith('track', 'PageView');

    jest.clearAllMocks();
    destination.config.custom!.pageview = false;
    destination.config.init = false;
    elbwalker.push(event);
    expect(mockFn).not.toHaveBeenCalledWith('track', 'PageView');
  });

  test('push standard event', () => {
    destination.config.mapping = {
      entity: { action: { custom: { track: 'Contact' } } },
    };

    elbwalker.push('walker destination', destination);
    elbwalker.push(event);
    expect(mockFn).toHaveBeenCalledWith('track', 'Contact', {});
  });

  test('push purchase', () => {
    destination.config.mapping = {
      entity: {
        action: {
          custom: { track: 'Purchase', name: 'title', value: 'revenue' },
        },
      },
    };
    elbwalker.push('walker destination', destination);

    elbwalker.push(event, { title: 'Shirt', revenue: 42 });
    expect(mockFn).toHaveBeenCalledWith(
      'track',
      'Purchase',
      expect.objectContaining({
        content_name: 'Shirt',
        currency: 'EUR',
        value: 42,
      }),
    );

    elbwalker.push(event);
    expect(mockFn).toHaveBeenCalledWith(
      'track',
      'Purchase',
      expect.objectContaining({ value: 1 }),
    );
  });

  test('push addtocart', () => {
    destination.config.mapping = {
      entity: {
        action: {
          custom: { track: 'AddToCart', name: 'title', value: 'price' },
        },
      },
    };

    elbwalker.push('walker destination', destination);
    elbwalker.push(event, { title: 'Shirt', price: 3.14 });
    expect(mockFn).toHaveBeenCalledWith(
      'track',
      'AddToCart',
      expect.objectContaining({
        content_name: 'Shirt',
        currency: 'EUR',
        value: 3.14,
      }),
    );
  });
});
