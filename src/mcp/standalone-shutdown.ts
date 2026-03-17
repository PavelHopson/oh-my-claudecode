export interface ShutdownProcessLike {
  once(event: string, listener: () => void): unknown;
  stdin?: {
    once(event: string, listener: () => void): unknown;
  } | null;
}

export interface RegisterStandaloneShutdownHandlersOptions {
  onShutdown: (reason: string) => void | Promise<void>;
  processRef?: ShutdownProcessLike;
}

/**
 * Register MCP-server shutdown hooks for both explicit signals and the implicit
 * "parent went away" cases that background agents hit when their stdio pipes
 * are closed without forwarding SIGTERM/SIGINT.
 */
export function registerStandaloneShutdownHandlers(
  options: RegisterStandaloneShutdownHandlersOptions
): { shutdown: (reason: string) => Promise<void> } {
  const processRef = options.processRef ?? process;
  let shutdownPromise: Promise<void> | null = null;

  const shutdown = async (reason: string): Promise<void> => {
    if (!shutdownPromise) {
      shutdownPromise = Promise.resolve(options.onShutdown(reason));
    }
    return shutdownPromise;
  };

  const register = (event: string, reason: string): void => {
    processRef.once(event, () => {
      void shutdown(reason);
    });
  };

  register('SIGTERM', 'SIGTERM');
  register('SIGINT', 'SIGINT');
  register('disconnect', 'parent disconnect');
  processRef.stdin?.once('end', () => {
    void shutdown('stdin end');
  });
  processRef.stdin?.once('close', () => {
    void shutdown('stdin close');
  });

  return { shutdown };
}
