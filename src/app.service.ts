import { Injectable, Logger } from '@nestjs/common';
import { readFile } from 'fs/promises';
import handlebars from 'handlebars';
import { join } from 'path';
import * as puppeteer from 'puppeteer';

import { IOneMovie, IPpopularMovies } from './the-movie-db/interfaces';
import { TheMovieDbService } from './the-movie-db/the-movie-db.service';
import { getTranslate } from './translate';

const TEMPLATE_FOLDER_PATH = join(__dirname, 'templates');

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  private readonly selfUrl: string;
  private readonly posterPath: string;

  constructor(private readonly theMovieDbService: TheMovieDbService) {
    this.selfUrl = process.env.SELF_URL;
    this.posterPath = 'http://image.tmdb.org/t/p/w185';
  }

  public async getPopularMovies(parameters: {
    page: number;
    lang?: string;
  }): Promise<Buffer> {
    const { results } = await this.theMovieDbService.popularMovies(parameters);
    const movieListHtml = this.generateMovieListHtml(results);
    const htmlToSend = await this.buildHtmlMovies({
      movieListHtml,
      templateName: 'movies.html',
      lang: parameters.lang || 'en',
    });
    const pdfBuffer = await this.convertHtmlToPdf(htmlToSend);
    return pdfBuffer;
  }

  public async getMovieById(id: string, lang?: string): Promise<Buffer> {
    const result = await this.theMovieDbService.movieById(id);
    const htmlToSend = await this.buildHtmlMovies({
      movieListHtml: this.generateOneMovieHtml(result),
      templateName: 'movie.html',
      lang: lang || 'en',
    });
    const pdfBuffer = await this.convertHtmlToPdf(htmlToSend);
    return pdfBuffer;
  }

  private generateOneMovieHtml(data: IOneMovie): string {
    return `
      <div class="movie-item">
        <a href="${this.selfUrl}/movies/${data.id}" class="movie-title">${data.title}</a>
        <div class="movie-poster">
          <img src="${this.posterPath}${data.poster_path}" alt="${data.title} Poster" />
        </div>
        <div class="movie-release-date">Release Date: ${data.release_date}</div>
        <div class="movie-vote-average">Vote Average: ${data.vote_average}</div>
        <p class="movie-overview">${data.overview}</p>
      </div>
    `;
  }

  private generateMovieListHtml(data: IPpopularMovies['results']): string {
    return data
      .map(
        (movie) => `
          <div class="movie-item">
            <a href="${this.selfUrl}/movies/${movie.id}" class="movie-title">${movie.title}</a>
            <div class="movie-release-date">Release Date: ${movie.release_date}</div>
            <div class="movie-vote-average">Vote Average: ${movie.vote_average}</div>
            <p class="movie-overview">${movie.overview}</p>
          </div>
        `,
      )
      .join('\n');
  }

  private async buildHtmlMovies(parameters: {
    movieListHtml: string;
    templateName: string;
    lang: string;
  }) {
    const { movieListHtml, templateName, lang } = parameters;

    const html = await readFile(join(TEMPLATE_FOLDER_PATH, `${templateName}`), {
      encoding: 'utf-8',
    });
    const translations = await getTranslate(lang || 'en');
    const template = handlebars.compile(html);

    const htmlToSend = template({ movieListHtml, ...translations });
    return htmlToSend;
  }

  private async convertHtmlToPdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--allow-file-access-from-files',
      ],
    });
    try {
      const page = await browser.newPage();
      await page.setContent(html, {
        waitUntil: ['domcontentloaded', 'networkidle2'],
      });
      await page.emulateMediaType('screen');
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
      });
      return pdfBuffer;
    } catch (error) {
      throw error;
    } finally {
      await browser.close();
    }
  }
}
