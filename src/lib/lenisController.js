let lenisInstance = null;

export function registerLenis(instance) {
  lenisInstance = instance;
}

export function unregisterLenis(instance) {
  if (lenisInstance === instance) {
    lenisInstance = null;
  }
}

export function stopLenis() {
  lenisInstance?.stop();
}

export function startLenis() {
  lenisInstance?.start();
}
