import type { z } from 'zod';
import { apiErrorSchema } from './types';

const API_BASE_URL = 'http://localhost:3000';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request<T>(
    endpoint: string,
    schema: z.ZodSchema<T>,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      const jsonData = await response.json();

      if (!response.ok) {
        const errorResult = apiErrorSchema.safeParse(jsonData);
        if (errorResult.success) {
          throw new Error(errorResult.data.error);
        }
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = schema.safeParse(jsonData);
      if (!result.success) {
        console.error('API response validation failed:', result.error);
        throw new Error('Invalid API response format');
      }

      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  }

  async get<T>(endpoint: string, schema: z.ZodSchema<T>): Promise<T> {
    return this.request<T>(endpoint, schema, { method: 'GET' });
  }

  async post<T>(endpoint: string, schema: z.ZodSchema<T>, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, schema, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
