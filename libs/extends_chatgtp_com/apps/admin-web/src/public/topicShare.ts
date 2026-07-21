export default async function topicShare({ topicId }: { topicId: string }) {
  const shareUrl = new URL("/user-web/", window.location.origin);
  const params = new URLSearchParams({ topicId });
  shareUrl.hash = `/?${params.toString()}`;
  await navigator.clipboard.writeText(shareUrl.toString());
}
