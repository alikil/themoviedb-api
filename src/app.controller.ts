import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';

import { AppService } from './app.service';

import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // health check
  @Get()
  public async root() {
    return 'OK';
  }

  @Get('movies')
  public async movies(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: string,
    @Query('lang') lang?: string,
  ) {
    const parameters = { page: Number(page) || 1, lang };
    const pdfBuffer = await this.appService.getPopularMovies(parameters);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=popular-movies.pdf',
    );
    res.send(pdfBuffer);
  }

  @Get('movies/:id')
  public async getMovieById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Query('lang') lang?: string,
  ) {
    const pdfBuffer = await this.appService.getMovieById(id, lang);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=movie-${id}.pdf`,
    );
    res.send(pdfBuffer);
  }
}
