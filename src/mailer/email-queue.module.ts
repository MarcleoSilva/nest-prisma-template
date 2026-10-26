import { BullModule } from "@nestjs/bullmq";
import { Inject, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EMAIL_QUEUE } from "./email-queue.constants";

@Module({
    imports: [
        BullModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            connection: {
                host: configService.get<string>('REDIS_HOST', 'localhost'),
                port: configService.get<number>('REDIS_PORT', 6379),
                password: configService.get<string>('REDIS_PASSWORD')
            }
        })
        }),
        BullModule.registerQueue({name: EMAIL_QUEUE})
    ],
    exports: [BullModule]
})

export class EmailQueueModule {}