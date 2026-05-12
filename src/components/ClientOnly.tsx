import { useEffect, useLayoutEffect, useState } from "react";

// useLayoutEffect fires synchronously after DOM mutations, before the browser
// paints — so client-only content appears on the very first visible frame.
// Aliased to useEffect on the server to avoid SSR hydration warnings.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useIsomorphicLayoutEffect(() => { setMounted(true); }, []);
  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
