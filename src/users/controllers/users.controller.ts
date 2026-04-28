import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('users')
export class UsersController {

    @Get()
    getUsers() {
        return [{username: 'Marcleo', email:'marcleo.com'}];
    }
    
    @Post()
    createUser(@Req() request: Request, @Res() response: Response) {
        console.log(request.body);
        response.send('Created');
    }
}
