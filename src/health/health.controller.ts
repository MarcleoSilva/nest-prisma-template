import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags("Health")
@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) {}
    
    @Public()
    @Get()
    async checkHealth() {
        return this.healthService.testApiHealth();
    }

}
