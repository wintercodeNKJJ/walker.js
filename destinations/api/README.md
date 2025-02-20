# API web destination for walker.js

Made to be used with [@elbwalker/walker.js](https://github.com/elbwalker/walker.js).

More detailed information and examples can be found in the [documentation](https://docs.elbwalker.com/).

## 🤓 Usage

Start by setting up the config for the destination. Optional fields as comments.
Destinations can be used via node or directly in the browser.

## Configuration

```ts
import { DestinationAPI } from '@elbwalker/destination-web-api';

const config /* : DestinationAPI.Config */ = {
  // consent: { marketing: true }, // Neccessary consent states
  custom: {
    url: 'https://httpbin.org/anything', // Required
    // transport: 'fetch' // fetch (default), xhr or beacon
  },
  // init: true, // Skip the initialisation
  // mapping: {
  //   '*': { '*': {} }, // Process all events
  // },
};
```

### Node usage

```sh
npm i --save @elbwalker/destination-web-api
```

```ts
import { elb } from '@elbwalker/walker.js';
import destinationAPI from '@elbwalker/destination-web-api';

elb('walker destination', destinationAPI, config);
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
      'https://cdn.jsdelivr.net/npm/@elbwalker/destination-web-api/dist/index.mjs'
    )
  ).default;

  elb('walker destination', destination, config);
</script>
```

## Contribute

Feel free to contribute by submitting an [issue](https://github.com/elbwalker/walker.js/issues), starting a [discussion](https://github.com/elbwalker/walker.js/discussions) or getting in [contact](https://calendly.com/elb-alexander/30min).
