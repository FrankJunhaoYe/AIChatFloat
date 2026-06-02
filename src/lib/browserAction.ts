/**
 * Toolbar-action API, normalized across manifest versions.
 *
 * MV3 (Chrome, Edge, Firefox-MV3) exposes `browser.action`; MV2 (Firefox default)
 * exposes `browser.browserAction`. The shapes we use are identical, so we pick
 * whichever exists.
 */
export interface ActionApi {
  onClicked: {
    addListener(callback: (tab: { id?: number }) => void): void;
  };
}

export interface ActionProvider {
  action?: ActionApi;
  browserAction?: ActionApi;
}

export function getActionApi(provider: ActionProvider): ActionApi {
  const action = provider.action ?? provider.browserAction;
  if (!action) {
    throw new Error('No toolbar action API available (neither action nor browserAction)');
  }
  return action;
}
