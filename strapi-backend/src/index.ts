// import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }) {
    strapi.server.use(async (ctx, next) => {
      if (ctx.path === '/') {
        ctx.status = 200;
        ctx.body = { status: 'ok' };
        return;
      } else if (ctx.path === '/api/video_quiz_collection') {
        try {
          console.log('Received request for /api/video_quiz_collection');
          ctx.status = 200;
          ctx.body = { message: 'Collection request received successfully.' };
        } catch (error) {
          console.log('Error processing /api/video_quiz_collection:', error);
          ctx.status = 500;
          ctx.body = { error: 'Internal server error.' };
        }
        return;
      } else {
        console.log('An error occurred while processing the request to:', ctx.path);
      }
      await next();
    });
  },
  
  bootstrap({ strapi }) {
    const logInfo = (...args: unknown[]) =>
      (strapi?.log?.info ? strapi.log.info.bind(strapi.log) : console.log)(...args);
    const logError = (...args: unknown[]) =>
      (strapi?.log?.error ? strapi.log.error.bind(strapi.log) : console.error)(...args);

    const handleSignal = (signal: string) => {
      logInfo(`Strapi shutdown initiated (signal: ${signal}).`);
    };

    process.on('SIGINT', () => handleSignal('SIGINT'));
    process.on('SIGTERM', () => handleSignal('SIGTERM'));
    // Nodemon/pm2 reload signal (optional)
    process.on('SIGUSR2', () => handleSignal('SIGUSR2'));

    process.on('uncaughtException', (error: unknown) => {
      logError('Uncaught exception - Strapi will shut down:', error);
      // Allow Strapi/PM to perform graceful shutdown by setting exitCode
      process.exitCode = 1;
    });

    process.on('unhandledRejection', (reason: unknown) => {
      logError('Unhandled promise rejection - Strapi will shut down:', reason);
      process.exitCode = 1;
    });

    // Log when HTTP server closes
    const httpServer = (strapi as any)?.server?.httpServer;
    if (httpServer && typeof httpServer.on === 'function') {
      httpServer.on('close', () => {
        logInfo('HTTP server closed. Strapi has stopped accepting connections.');
      });
    }
  },
};