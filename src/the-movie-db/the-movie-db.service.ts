import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import fetch from 'node-fetch';

import {
  IPpopularMovies,
  ITheMovieDbAuthErrorResponse,
  ITheMovieDbAuthSuccessResponse,
  IOneMovie,
} from './interfaces';

@Injectable()
export class TheMovieDbService implements OnModuleInit {
  private readonly logger = new Logger(TheMovieDbService.name);

  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.apiUrl = 'https://api.themoviedb.org/3';
    this.apiKey = process.env.THE_MOVIE_DB_READ_API_KEY;
  }

  async onModuleInit() {
    try {
      const auth = await this.authRequest();
      if (auth.success) this.logger.log('themoviedb auth success');
      else throw new Error('TheMovieDb auth error');
    } catch (error) {
      throw error;
    }
  }

  public async popularMovies(pagination: {
    page: number;
  }): Promise<IPpopularMovies> {
    const { page } = pagination || { page: 1 };
    const result = await fetch(`${this.apiUrl}/movie/popular?page=${page}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    const data = await result.json();
    return data;
  }

  public async movieById(id: string): Promise<IOneMovie> {
    const result = await fetch(`${this.apiUrl}/movie/${id}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    const data = await result.json();
    return data;
  }

  private async authRequest(): Promise<
    ITheMovieDbAuthErrorResponse | ITheMovieDbAuthSuccessResponse
  > {
    const result = await fetch(`${this.apiUrl}/authentication`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    const data = await result.json();
    return data;
  }
}
