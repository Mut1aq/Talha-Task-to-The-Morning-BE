import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto"
@Controller('posts')

export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get()
    async getIndex() {

        return await this.postsService.getIndex()
    }

    @Post()
    addPost(
        @Body() createPostDto: CreatePostDto,
        @Body('title') postTitle: string,
        @Body('textBody') postBody: string,
        @Body('likes') postLikes: number,
    ) {

        return this.postsService.insertPost(postTitle,
            postBody,
            postLikes)

    }

    @Get(':id')
    singlePost(@Param('id') id: number) {
        return this.postsService.getSinglePost(id);
    }
}