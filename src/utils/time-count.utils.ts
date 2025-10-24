/**
 * Devuelve los milisegundos transcurridos entre ahora y hace N unidades.
 * (Se mantienen funciones antiguas por compatibilidad interna si se usan.)
 */
/**
 * Devuelve la fecha (UTC, sin ms) correspondiente a "hace 7 días".
 * Formato: YYYY-MM-DDTHH:mm:ssZ
 */
function dateWeekBefore(): string {
  return getDateBeforeISO(7, 'days');
}

/**
 * Devuelve la fecha (UTC, sin ms) correspondiente a "hace 1 día".
 * Formato: YYYY-MM-DDTHH:mm:ssZ
 */
function dateDayBefore(): string {
  return getDateBeforeISO(1, 'days');
}

/**
 * Devuelve la fecha (UTC, sin ms) correspondiente a "hace 3 días".
 * Formato: YYYY-MM-DDTHH:mm:ssZ
 */
function dateThreeDaysBefore(): string {
  return getDateBeforeISO(3, 'days');
}

/**
 * Devuelve una fecha ISO (UTC, sin milisegundos) correspondiente a "ahora menos X unidades".
 * Formato: YYYY-MM-DDTHH:mm:ssZ
 *
 * @param amount número mayor que 0
 * @param unit 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks'
 */
function getDateBeforeISO(
  amount: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks',
): string {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new TypeError('amount debe ser un número positivo');
  }

  const now = new Date();
  const d = new Date(now.getTime());

  switch (unit) {
    case 'weeks':
      d.setDate(d.getDate() - amount * 7);
      break;
    case 'days':
      d.setDate(d.getDate() - amount);
      break;
    case 'hours':
      d.setHours(d.getHours() - amount);
      break;
    case 'minutes':
      d.setMinutes(d.getMinutes() - amount);
      break;
    case 'seconds':
      d.setSeconds(d.getSeconds() - amount);
      break;
    default:
      throw new TypeError('unit inválida');
  }

  // Formatear sin milisegundos y en UTC
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  const seconds = String(d.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

export { dateWeekBefore, dateDayBefore, dateThreeDaysBefore, getDateBeforeISO };
