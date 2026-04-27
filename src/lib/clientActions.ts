'use client';

interface SharePayload {
  title: string;
  text: string;
  url?: string | null;
}

export async function shareContent({ title, text, url }: SharePayload) {
  const shareUrl = url || window.location.href;

  if (navigator.share) {
    await navigator.share({ title, text, url: shareUrl });
    return;
  }

  await navigator.clipboard.writeText(`${title}\n${text}\n${shareUrl}`);
}

export function getDirectionsUrl({
  lat,
  lng,
  query,
}: {
  lat?: number | null;
  lng?: number | null;
  query?: string | null;
}) {
  const target = lat && lng ? `${lat},${lng}` : query?.trim();
  if (!target) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(target)}`;
}
