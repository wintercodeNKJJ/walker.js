# Google Ads web destination for walker.js

Made to be used with [@elbwalker/walker.js](https://github.com/elbwalker/walker.js).

More detailed information and examples can be found in the [documentation](https://docs.elbwalker.com/).

## 🤓 Usage

Start by setting up the config for the destination. Optional fields as comments.
Destinations can be used via node or directly in the browser.

## Configuration

```ts
import { DestinationGoogleAds } from '@elbwalker/destination-web-google-ads';

const config /* : DestinationGoogleAds.Config */ = {
  // consent: { marketing: true }, // Neccessary consent states
  custom: {
    conversionId: 'AW-123456789', // Ads accounts id used for every conversion
    // currency: 'EUR', // Default currency is EUR
    // defaultValue: 1, // Used default value for conversions
  },
  // init: true, // Skip the initialisation
  // loadScript: true, // Load additional required scripts on init
  mapping: {
    // e.g. order
    entity: {
      // e.g. complete
      action: {
        custom: {
          id: 'order_id', // Property key to use as transaction id
          label: 'abc', // Conversion label
          value: 'revenue', // Name of data property key to use for value
        },
      },
    },
  },
};
```

### Node usage

```sh
npm i --save @elbwalker/destination-web-google-ads
```

```ts
import { elb } from '@elbwalker/walker.js';
import destinationGoogleAds from '@elbwalker/destination-web-google-ads';

elb('walker destination', destinationGoogleAds, config);
```

### Browser usage

Loading the destination via dynamic import

```html
<script>
  // Make sure to initialize the elb function once.
  function elb() {
    (window.elbLayer = window.elbLayer || []).push(arguments);
  }

  // Upload the dist/index.mjs on your own server
  const destination = (
    await import(
      'https://cdn.jsdelivr.net/npm/@elbwalker/destination-web-google-ads/dist/index.mjs'
    )
  ).default;

  elb('walker destination', destination, config);
</script>
```

## Contribute

Feel free to contribute by submitting an [issue](https://github.com/elbwalker/walker.js/issues), starting a [discussion](https://github.com/elbwalker/walker.js/discussions) or getting in [contact](https://calendly.com/elb-alexander/30min).
