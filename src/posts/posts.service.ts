import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { readFileSync } from 'fs';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostModel } from './post.model'

@Injectable()
export class PostsService {
    obj = {}
    fileData = []
    constructor(@InjectRepository(Post) private postsRepository: Repository<Post>) { }


    getPosts(row): Promise<[Post[], number]> {
        const take = row || 3
        return this.postsRepository.findAndCount(
            {
                where: {},
                take: take,
            }
        );// select * from post
    }

    getAllPosts(): Promise<Post[]> {
        return this.postsRepository.find(); // select * from post
    }


    insertPost(title: string, textBody: string, likes: number): Promise<PostModel> {
        const post = {

            title,
            textBody,
            likes
        }
        const newPost = this.postsRepository.create(post)

        return this.postsRepository.save(newPost)

    }

    getPost(postId: number): Promise<Post> {
        return this.postsRepository.findOne({ where: { id: postId } })
    }

    async putPost(postId: number, title: string, textBody: string, likes: number) {
        console.log("hi")
        const post = await this.postsRepository.findOne({ where: { id: postId } })
        if (post) {
            const updatedPost = { title, textBody, likes }
            this.postsRepository.update(postId, updatedPost)
            return this.postsRepository.save(updatedPost)
        } else {
            return { msg: "Invalid Id" }
        }

    }

    async deletePost(postId: number) {
        const post = await this.postsRepository.findOne({ where: { id: postId } })
        if (post) {
            this.postsRepository.delete(postId)
            return this.postsRepository.save(post)
        } else {
            return { msg: "Invalid Id" }
        }


    }

    exportCSV(posts: PostModel[]) {
        console.log(posts, "*");
        const dirName = './downloads';

        const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
        let rows = []
        const keys = Object.keys(posts[0]) // store the keys (columns)

        rows.push(keys.join(', ').replace('"', '').replace("'", ''))
        for (const row of posts) {
            const values = keys.map(header => {
                const val = row[header]
                return `${val}`;
            });
            rows.push(values.join(','));
        }


        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
        }

        fs.writeFile(`./${dirName}/table-data-${randomName}.csv`, rows.join('\n'), (err) => {
            if (err) throw err;
        })
        return 0
    }

    async seeUploadedFile(file): Promise<PostModel[]> {
        let keys: string[]; // File Keys
        let values: string[];
        readFileSync(`./uploads/${file}`, 'utf-8').split(/\r?\n/).forEach((line, index) => {
            if (!line) {
                return
            }
            if (index === 0) {
                keys = line.split(',') // store file keys in the var as an array
            } else {
                values = line.split(',') // store values of each line after the first line
                for (let i = 0; i < values.length; i++) {
                    keys[i] = keys[i].trim()
                    values[i] = values[i].trim()

                    if (keys[i] === 'id' || keys[i].trim() === 'likes') {
                        this.obj[keys[i]] = parseInt(values[i])
                    } else {
                        this.obj[keys[i]] = values[i]
                    }
                }
                this.fileData.push({ ...this.obj })
            }
        });
        await this.postsRepository.upsert(this.fileData, ["id"]);
        return this.fileData
    }
}
