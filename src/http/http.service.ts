import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
  private readonly logger = new Logger(HttpService.name);
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      timeout: 5000,
    });
  }

  async get<T>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> {
    try {
      return this.httpClient.get<T>(url, config);
    } catch (error) {
      this.loggingError('GET', url, error);
      throw error;
    }
  }

  async post<T>(
    url: string,
    data: {},
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> {
    try {
      return this.httpClient.post<T>(url, data, config);
    } catch (error) {
      this.loggingError('POST', url, error);
      throw error;
    }
  }

  async delete<T>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> {
    try {
      return this.httpClient.delete<T>(url, config);
    } catch (error) {
      this.loggingError('DELETE', url, error);
      throw error;
    }
  }

  private loggingError(method: string, url: string, error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const code = error.code;
      const message = error.message;
      this.logger.error(
        `[${method}] ${url} failed: ${code} ${status} - ${message}`,
      );
    } else {
      this.logger.error(
        `[${method}] ${url} failed with unknown error`,
        String(error),
      );
    }
  }
}
