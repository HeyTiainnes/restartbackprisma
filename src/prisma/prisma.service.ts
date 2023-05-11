import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { PrismaClient } from '@prisma/client'
@Injectable()

//On appel (extend) le prismaClient
export class PrismaService extends PrismaClient {
    //on cree donc un constructeur qui fait appel a l'objet parent et on lui passe les options nécessaires au PrismaClient : 
    // export class PrismaClient<
    //     T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
    //     U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
    //     GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    //     ? T['rejectOnNotFound']
    //     : false
    // > {
    //     /**


    //on injecte configservice mais sans read only sans private read only car used directement au nvx du contructor et poas dans une methode
    constructor(configService: ConfigService) {
        super({
            datasources: {
                db: {
                    // npm i nestjs/config pour appeler l'url du fichier env. ensuit on importe import { ConfigModule } from '@nestjs/config'; dans app.module.ts
                    // ensuite on peut utiliser configService.get("DATABASE_URL")
                    url: configService.get("DATABASE_URL"),
                },
            },

        });
    }
}
