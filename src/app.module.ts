import { TheMovieDbModule } from './the-movie-db/the-movie-db.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TheMovieDbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
