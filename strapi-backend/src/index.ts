// import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }) {
    // Helper function to get level with types and collections
    const getLevelWithData = async (levelName: string) => {
      const level = await strapi.entityService.findMany('api::level.level', {
        filters: {
          level_title: levelName
        }
      });
      
      if (level.length === 0) {
        return null;
      }
      
      const levelWithTypes = await strapi.entityService.findOne('api::level.level', level[0].id, {
        populate: {
          types: {
            populate: {
              collection_1s: {
                populate: '*'
              }
            }
          }
        }
      });
      
      return levelWithTypes;
    };

    // Helper function to find type by name within level data
    const findTypeInLevel = (levelData: any, typeName: string) => {
      const types = levelData?.types || [];
      return types.find((t: any) => t.type_title === typeName);
    };

    // Global CORS middleware
    strapi.server.use(async (ctx, next) => {
      // Set CORS headers for all requests
      ctx.set('Access-Control-Allow-Origin', 'http://localhost:5173');
      ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      ctx.set('Access-Control-Allow-Credentials', 'true');

      // Handle preflight OPTIONS requests
      if (ctx.method === 'OPTIONS') {
        ctx.status = 200;
        return;
      }

      await next();
    });

    // Custom routes for hierarchical API structure
    strapi.server.use(async (ctx, next) => {
      // Health check endpoint
      if (ctx.path === '/') {
        ctx.status = 200;
        ctx.body = { status: 'ok', message: 'Strapi API is running' };
        return;
      }

      // Level endpoints
      if (ctx.path.startsWith('/level')) {
        try {
          console.log('Level request received:', ctx.path);
          
          // GET /level - Get all levels
          if (ctx.path === '/level' && ctx.method === 'GET') {
            const levels = await strapi.entityService.findMany('api::level.level', {
              populate: {
                types: {
                  populate: {
                    collection_1s: {
                      populate: '*'
                    }
                  }
                }
              }
            });
            ctx.status = 200;
            ctx.body = { data: levels };
            return;
          }

          // GET /level/:name - Get specific level by name
          const levelNameMatch = ctx.path.match(/^\/level\/([^\/]+)$/);
          if (levelNameMatch && ctx.method === 'GET') {
            const levelName = decodeURIComponent(levelNameMatch[1]);
            const level = await strapi.entityService.findMany('api::level.level', {
              filters: {
                level_title: levelName
              },
              populate: {
                types: {
                  populate: {
                    collection_1s: {
                      populate: '*'
                    }
                  }
                }
              }
            });
            
            if (level.length === 0) {
              ctx.status = 404;
              ctx.body = { error: `Level '${levelName}' not found` };
              return;
            }
            
            ctx.status = 200;
            ctx.body = { data: level[0] };
            return;
          }

          // Get all types under level
          const typeMatch = ctx.path.match(/^\/level\/([^\/]+)\/type$/);
          if (typeMatch && ctx.method === 'GET') {
            const levelName = decodeURIComponent(typeMatch[1]);
            const levelData = await getLevelWithData(levelName);
            
            if (!levelData) {
              ctx.status = 404;
              ctx.body = { error: `Level '${levelName}' not found` };
              return;
            }
            
            const types = levelData?.types || [];
            ctx.status = 200;
            ctx.body = { data: types };
            return;
          }

          // Get specific type under level: /level/beginner/loops
          const specificTypeMatch = ctx.path.match(/^\/level\/([^\/]+)\/([^\/]+)$/);
          if (specificTypeMatch && ctx.method === 'GET') {
            const levelName = decodeURIComponent(specificTypeMatch[1]);
            const typeName = decodeURIComponent(specificTypeMatch[2]);
            const levelData = await getLevelWithData(levelName);
            
            if (!levelData) {
              ctx.status = 404;
              ctx.body = { error: `Level '${levelName}' not found` };
              return;
            }
            
            const type = findTypeInLevel(levelData, typeName);
            if (!type) {
              ctx.status = 404;
              ctx.body = { error: `Type '${typeName}' not found in level '${levelName}'` };
              return;
            }
            
            ctx.status = 200;
            ctx.body = { data: type };
            return;
          }

          // Collection endpoints under level/type: /level/beginner/loops/collection
          const collectionMatch = ctx.path.match(/^\/level\/([^\/]+)\/([^\/]+)\/collection$/);
          if (collectionMatch && ctx.method === 'GET') {
            const levelName = decodeURIComponent(collectionMatch[1]);
            const typeName = decodeURIComponent(collectionMatch[2]);
            const levelData = await getLevelWithData(levelName);
            
            if (!levelData) {
              ctx.status = 404;
              ctx.body = { error: `Level '${levelName}' not found` };
              return;
            }
            
            const type = findTypeInLevel(levelData, typeName);
            if (!type) {
              ctx.status = 404;
              ctx.body = { error: `Type '${typeName}' not found in level '${levelName}'` };
              return;
            }
            
            const collections = type.collection_1s || [];
            ctx.status = 200;
            ctx.body = { data: collections };
            return;
          }

          // Specific collection item: /level/beginner/loops/collection/1
          const specificCollectionMatch = ctx.path.match(/^\/level\/([^\/]+)\/([^\/]+)\/collection\/(\d+)$/);
          if (specificCollectionMatch && ctx.method === 'GET') {
            const levelName = decodeURIComponent(specificCollectionMatch[1]);
            const typeName = decodeURIComponent(specificCollectionMatch[2]);
            const collectionId = specificCollectionMatch[3];
            const levelData = await getLevelWithData(levelName);
            
            if (!levelData) {
              ctx.status = 404;
              ctx.body = { error: `Level '${levelName}' not found` };
              return;
            }
            
            const type = findTypeInLevel(levelData, typeName);
            if (!type) {
              ctx.status = 404;
              ctx.body = { error: `Type '${typeName}' not found in level '${levelName}'` };
              return;
            }
            
            const collections = type.collection_1s || [];
            const collection = collections.find(c => c.id == collectionId);
            
            if (!collection) {
              ctx.status = 404;
              ctx.body = { error: `Collection not found in ${levelName}/${typeName}` };
              return;
            }
            
            ctx.status = 200;
            ctx.body = { data: collection };
            return;
          }

        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          console.error('Error in level hierarchy:', error);
          ctx.status = 500;
          ctx.body = { error: message };
          return;
        }
      }

      // Legacy collection endpoint for backward compatibility
      if (ctx.path === '/collection') {
        try {
          console.log('Collection request received');
          const data = await strapi.entityService.findMany('api::video.video', {
            populate: '*',
          });
          ctx.status = 200;
          ctx.body = { data };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          ctx.status = 500;
          ctx.body = { error: message };
        }
        return;
      }

      console.log('Request to:', ctx.path, 'Method:', ctx.method);
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