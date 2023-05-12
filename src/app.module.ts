import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
// on ajoute ConfigModule aux imports
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
@Module({
  // ConfigModule.forRoot({isGlobal:true}) : IsGlobal car utile à differents endroits de l'application
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule, MailerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
