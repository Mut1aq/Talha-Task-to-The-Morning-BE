import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    Put,
    UseInterceptors,
    UploadedFile,
    Res,
    Req,
} from '@nestjs/common';
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto"
import { title } from 'process';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../utils/file-uploading.utils';
import { diskStorage } from 'multer';
import { readFileSync } from 'fs';
import { ReadLine } from 'readline';
import { PostModel } from './post.model';
import { PostsModule } from './posts.module';

@Controller('posts')

export class PostsController {


    constructor(private readonly postsService: PostsService) { }
    @Get()
    getAllPosts(
    ) {
        return this.postsService.getAllPosts()
    }
    @Get(":row")
    getPosts(
        @Param('row') row: number
    ) {
        return this.postsService.getPosts(row)
    }


    @Post('exportCSV')
    exportCSV(
        @Body('posts') posts: PostModel[],
    ) {
        return this.postsService.exportCSV(posts)
    }


    @Post('file')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadedFile(@UploadedFile() file: Express.Multer.File) {
        const response = {
            originalname: file?.originalname,
            filename: file?.filename, // must be stored
        };
        return this.postsService.seeUploadedFile(response.filename)
    }

    @Get('file/:filePath')
    seeUploadedFile(@Param('filePath') file: Express.Multer.File) {
        return this.postsService.seeUploadedFile(file)
    }


    @Post()
    insertPost(
        @Body() createPostDto: CreatePostDto,
        @Body('title') postTitle: string,
        @Body('textBody') postTextBody: string,
        @Body('likes') postLikes: number,
    ) {

        return this.postsService.insertPost(postTitle, postTextBody, postLikes)

    }

    // @Get(':id')
    // getPost(@Param('id') id: number) {
    //     return this.postsService.getPost(id);
    // }

    @Put('/:id')
    putPost(
        @Param('id') id: number,
        @Body() createPostDto: CreatePostDto,
        @Body('title') postTitle: string,
        @Body('textBody') postTextBody: string,
        @Body('likes') postLikes: number) {
        return this.postsService.putPost(id, postTitle, postTextBody, postLikes)
    }

    @Delete('/:id')
    deletePost(
        @Param('id') id: number
    ) {
        return this.postsService.deletePost(id)
    }
}