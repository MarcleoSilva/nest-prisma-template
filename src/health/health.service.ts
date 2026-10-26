import { Injectable } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Injectable()
export class HealthService {
    async testApiHealth() {
        return {message: "API is functional"}
    }
}
