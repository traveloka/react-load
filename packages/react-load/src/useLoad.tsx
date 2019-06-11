import { useState } from 'react';
import log from './utils/log';

export default function useLoad<T>(fn: (...args: any[]) => Promise<T>) {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState<T | null>(null);
  const [retry, setRetry] = useState<() => Promise<T | null>>(() => Promise.resolve(null));

  const trigger = async (...args: any[]) => {
    log('useLoad', 'entry');
    setLoading(true);
    setError(null);
    setResult(null);
    setRetry(() => {
      return () => trigger(...args);
    });
    let res = null;
    try {
      log('useLoad', 'execute');
      res = await fn(...args);
      setLoading(false);
      setResult(res);
      log('useLoad', 'done');
    } catch (error) {
      setLoading(false);
      setError(error);
      log('useLoad', 'error');
    }
    return res;
  };

  return {
    isLoading,
    error,
    isError: !(error === null),
    result,
    trigger,
    retry,
  };
}
