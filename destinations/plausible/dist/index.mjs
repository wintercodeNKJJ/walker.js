var n={config:{},init(t){let i=window,s=t.custom||{};return t.loadScript&&e(s.domain),i.plausible=i.plausible||function(){(i.plausible.q=i.plausible.q||[]).push(arguments)},!0},push(t){window.plausible(`${t.event}`,{props:t.data})}};function e(t,i="https://plausible.io/js/script.manual.js"){let s=document.createElement("script");s.src=i,t&&(s.dataset.domain=t),document.head.appendChild(s)}var a=n;export{a as default,n as destinationPlausible};
