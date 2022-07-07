import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostModel } from './post.model'

@Injectable()
export class PostsService {
    private posts: PostModel[] = []
    constructor(@InjectRepository(Post) private postsRepository: Repository<Post>) {

    }

    getIndex(): Promise<Post[]> {

        return this.postsRepository.find(); // select * from post
    }

    insertPost(title: string, textBody: string, likes: number): Promise<PostModel> {
        const obj = {

            title,
            textBody,
            likes
        }
        const newPost = this.postsRepository.create(obj)

        return this.postsRepository.save(newPost)

    }

    getSinglePost(postId: number) {
        return this.postsRepository.findOne({ where: { id: postId } })
    }

    private findPost(id: number): [PostModel, number] {
        const postIndex = this.posts.findIndex(pos => pos.id === id);
        const post = this.posts[postIndex];
        if (!post) {
            throw new NotFoundException('Could not find post.');
        }
        return [post, postIndex];
    }
}