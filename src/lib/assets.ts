export function absolutizeAssetUrl(assetUrl: string) {
  if (typeof window === "undefined") {
    return assetUrl;
  }

  return new URL(assetUrl, window.location.origin).toString();
}
