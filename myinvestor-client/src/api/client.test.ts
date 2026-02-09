import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient } from './client';
import { z } from 'zod';

global.fetch = vi.fn();

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient('http://localhost:3000');
    vi.clearAllMocks();
  });

  it('should make GET request with correct URL', async () => {
    const mockResponse = { data: 'test' };
    const schema = z.object({ data: z.string() });

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await client.get('/test', schema);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/test',
      expect.objectContaining({ method: 'GET' })
    );
    expect(result).toEqual(mockResponse);
  });

  it('should validate response with Zod schema', async () => {
    const mockResponse = { data: 'test' };
    const schema = z.object({ data: z.string() });

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await client.get('/test', schema);

    expect(result).toEqual(mockResponse);
  });

  it('should throw error for invalid response', async () => {
    const mockResponse = { data: 123 };
    const schema = z.object({ data: z.string() });

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await expect(client.get('/test', schema)).rejects.toThrow('Invalid API response format');
  });

  it('should handle API errors', async () => {
    const mockError = { error: 'Not found' };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => mockError,
    });

    const schema = z.object({ data: z.string() });

    await expect(client.get('/test', schema)).rejects.toThrow('Not found');
  });

  it('should make POST request with data', async () => {
    const mockResponse = { success: true };
    const schema = z.object({ success: z.boolean() });
    const postData = { quantity: 100 };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await client.post('/test', schema, postData);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/test',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(postData),
      })
    );
  });
});
