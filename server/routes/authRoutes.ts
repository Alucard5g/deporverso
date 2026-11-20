import { Router, Request, Response, NextFunction } from 'express';
import { userStore, MASTER_ADMIN_EMAIL, UserSyncEvent } from '../services/userStore.ts';
import {
  signCreatorStudioToken,
  verifyCreatorStudioToken,
} from '../realtime/streamStudioWs.ts';

export const authRouter = Router();

function extractSuperAdminCredential(req: Request): {
  authorized: boolean;
} {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7).trim();
    if (verifyCreatorStudioToken(bearerToken)) {
      return { authorized: true };
    }
  }

  const creatorKey = String(
    req.headers['x-creator-key'] || req.headers['x-admin-key'] || ''
  ).trim();
  if (creatorKey && userStore.isMasterOrAdminPassword(creatorKey)) {
    return { authorized: true };
  }

  return { authorized: false };
}

function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  const { authorized } = extractSuperAdminCredential(req);
  if (!authorized) {
    res.status(403).json({
      success: false,
      error: 'Acceso restringido: se requieren credenciales verificadas de Administrador CIG.',
    });
    return;
  }
  next();
}

/**
 * Stream Server-Sent Events (SSE) en tiempo real para sincronizar cambios de usuarios en < 1s
 * Nota: Solo emite metadatos no sensibles (revisión, acción y total) sin exponer contraseñas ni correos.
 */
authRouter.get('/sync-stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const sendSyncPayload = (payload: {
    action: string;
    revision: number;
    totalUsers: number;
    timestamp: string;
  }) => {
    try {
      res.write(`event: users_sync\n`);
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    } catch {
      // Ignore write failure on closed socket
    }
  };

  // Evento inicial inmediato con la revisión actual del servidor
  sendSyncPayload({
    action: 'connected',
    revision: userStore.getRevision(),
    totalUsers: userStore.getTotalUsers(),
    timestamp: new Date().toISOString(),
  });

  const onSync = (event: UserSyncEvent) => {
    sendSyncPayload({
      action: event.action,
      revision: event.revision,
      totalUsers: event.totalUsers,
      timestamp: event.timestamp,
    });
  };

  userStore.on('sync', onSync);

  const heartbeat = setInterval(() => {
    try {
      res.write(`: heartbeat ${Date.now()}\n\n`);
    } catch {
      // Closed
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    userStore.off('sync', onSync);
  });
});

/**
 * Login público contra el servidor persistente
 */
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  const result = userStore.verifyLogin(String(email || ''), String(password || ''));

  if (!result.success) {
    const statusCode = result.notFound ? 404 : result.message?.includes('suspendida') ? 403 : 401;
    res.status(statusCode).json({
      success: false,
      notFound: Boolean(result.notFound),
      role: result.role,
      isSuperAdmin: false,
      message: result.message || 'Credenciales inválidas.',
    });
    return;
  }

  const creatorToken = result.isSuperAdmin
    ? signCreatorStudioToken(MASTER_ADMIN_EMAIL)
    : undefined;

  res.json({
    success: true,
    user: result.user,
    role: result.role,
    isSuperAdmin: result.isSuperAdmin,
    creatorToken,
    revision: userStore.getRevision(),
  });
});

/**
 * Verificación de contraseña maestra desde AdminAuthSecurityModal
 */
authRouter.post('/admin-verify', (req: Request, res: Response) => {
  const { password } = req.body || {};
  const result = userStore.verifyAdminPassword(String(password || ''));

  if (!result.success) {
    res.status(401).json({
      success: false,
      isSuperAdmin: false,
      role: 'SUPER_ADMIN',
      message: result.message || 'Contraseña de administrador incorrecta.',
    });
    return;
  }

  const creatorToken = signCreatorStudioToken(MASTER_ADMIN_EMAIL);
  res.json({
    success: true,
    user: result.user,
    isSuperAdmin: true,
    role: 'SUPER_ADMIN',
    creatorToken,
    revision: userStore.getRevision(),
  });
});

/**
 * Registro público para interesados desde LoginGate
 */
authRouter.post('/register', (req: Request, res: Response) => {
  const { id, name, email, password, role } = req.body || {};
  const result = userStore.registerPublicUser({
    id,
    name,
    email: String(email || ''),
    password: String(password || ''),
    role,
  });

  if (!result.success) {
    res.status(result.status || 400).json({
      success: false,
      message: result.message || 'No se pudo completar el registro.',
    });
    return;
  }

  res.status(201).json({
    success: true,
    user: result.user,
    revision: result.revision,
  });
});

/**
 * Obtener directorio completo con contraseñas asignadas (Solo SuperAdmin)
 */
authRouter.get('/users', requireSuperAdmin, (_req: Request, res: Response) => {
  const { users, revision } = userStore.listUsersForAdmin();
  res.json({
    success: true,
    revision,
    users,
  });
});

/**
 * Crear o actualizar un usuario desde el Panel Administrador (Solo SuperAdmin)
 */
authRouter.post('/users', requireSuperAdmin, (req: Request, res: Response) => {
  try {
    const { user, revision } = userStore.upsertUserByAdmin(req.body || {});
    const { users } = userStore.listUsersForAdmin();
    res.status(201).json({
      success: true,
      user,
      users,
      revision,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err?.message || 'No se pudo guardar el usuario.',
    });
  }
});

/**
 * Sincronizar y migrar en lote usuarios existentes desde localStorage (Solo SuperAdmin)
 */
authRouter.post('/users/sync-batch', requireSuperAdmin, (req: Request, res: Response) => {
  const incoming = Array.isArray(req.body?.users) ? req.body.users : [];
  const result = userStore.syncBatchFromClient(incoming);
  res.json({
    success: true,
    importedCount: result.importedCount,
    updatedCount: result.updatedCount,
    users: result.users,
    revision: result.revision,
  });
});

/**
 * Actualizar contraseña de un usuario (Solo SuperAdmin)
 */
authRouter.patch('/users/:id/password', requireSuperAdmin, (req: Request, res: Response) => {
  const targetIdOrEmail = decodeURIComponent(req.params.id || '');
  const newPassword = String(req.body?.password || '').trim();
  if (!newPassword) {
    res.status(400).json({ success: false, error: 'La nueva contraseña no puede estar vacía.' });
    return;
  }

  const updated = userStore.updatePasswordByIdOrEmail(targetIdOrEmail, newPassword);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
    return;
  }

  const { users } = userStore.listUsersForAdmin();
  res.json({
    success: true,
    user: updated.user,
    users,
    revision: updated.revision,
  });
});

/**
 * Cambiar estado ACTIVO / SUSPENDIDO de un usuario (Solo SuperAdmin)
 */
authRouter.patch('/users/:id/status', requireSuperAdmin, (req: Request, res: Response) => {
  const targetId = decodeURIComponent(req.params.id || '');
  const explicitStatus =
    req.body?.status === 'ACTIVO' || req.body?.status === 'SUSPENDIDO'
      ? req.body.status
      : undefined;

  const updated = userStore.toggleStatusById(targetId, explicitStatus);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
    return;
  }

  const { users } = userStore.listUsersForAdmin();
  res.json({
    success: true,
    user: updated.user,
    users,
    revision: updated.revision,
  });
});

/**
 * Eliminar un usuario (Solo SuperAdmin)
 */
authRouter.delete('/users/:id', requireSuperAdmin, (req: Request, res: Response) => {
  try {
    const targetId = decodeURIComponent(req.params.id || '');
    const deleted = userStore.deleteUserById(targetId);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
      return;
    }
    const { users } = userStore.listUsersForAdmin();
    res.json({
      success: true,
      deletedEmail: deleted.deletedEmail,
      users,
      revision: deleted.revision,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err?.message || 'No se pudo eliminar el usuario.',
    });
  }
});
