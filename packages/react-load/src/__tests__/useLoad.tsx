import { renderHook, act } from 'react-hooks-testing-library';
import useLoad from '../useLoad';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
});

function flushPromises() {
  return new Promise(resolve => {
    jest.runAllTimers();
    setImmediate(resolve);
  });
}

describe('test useLoad', () => {
  it('isLoading should be true', async () => {
    const { result } = renderHook(() => useLoad(() => new Promise(resolve => setTimeout(resolve, 1000))));
    act(() => result.current.trigger());
    expect(result.current.isLoading).toBe(true);
    await flushPromises();
    expect(result.current.isLoading).toBe(false);
  });

  it('error should be the error exception', async () => {
    const { result } = renderHook(() =>
      useLoad(() => new Promise((_, reject) => setTimeout(() => reject('Oops'), 1000)))
    );
    act(() => result.current.trigger());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.isError).toBe(false);
    await flushPromises();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Oops');
    expect(result.current.isError).toBe(true);
  });

  it('result should be the return promise value', async () => {
    const { result } = renderHook(() =>
      useLoad(() => new Promise(resolve => setTimeout(() => resolve('Hello'), 1000)))
    );
    act(() => result.current.trigger());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.isError).toBe(false);
    expect(result.current.result).toBe(null);
    await flushPromises();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.isError).toBe(false);
    expect(result.current.result).toBe('Hello');
  });

  it('trigger should call the function', async () => {
    const mockFn = jest.fn();
    expect(mockFn).not.toHaveBeenCalled();
    const { result } = renderHook(() => useLoad(mockFn));
    act(() => result.current.trigger('Hello', 'World'));
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('Hello', 'World');
  });

  it('retry should call last function', async () => {
    const mockFn = jest.fn();
    expect(mockFn).not.toHaveBeenCalled();
    const { result } = renderHook(() => useLoad(mockFn));
    act(() => result.current.trigger('Hello', 'World'));
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('Hello', 'World');
    mockFn.mockReset();
    act(() => result.current.retry());
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('Hello', 'World');
  });
});
