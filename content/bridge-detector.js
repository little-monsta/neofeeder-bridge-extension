(() => {
  const api =
    typeof chrome !== "undefined" ? chrome : typeof browser !== "undefined" ? browser : undefined;
  const manifest = api?.runtime?.getManifest?.() || {};

  function postPong(event) {
    if (!event || event.source !== window) return;
    if (event.origin !== window.location.origin) return;

    const data = event.data;
    if (!data || data.type !== "NEOFEEDER_BRIDGE_PING") return;

    window.postMessage(
      {
        type: "NEOFEEDER_BRIDGE_PONG",
        nonce: data.nonce,
        requestId: data.requestId,
        name: "neofeeder-bridge",
        version: manifest.version || "unknown",
        channel: "unknown",
        capabilities: ["cors-dnr"],
      },
      window.location.origin,
    );
  }

  window.addEventListener("message", postPong);
})();
